"""
Episode 9, sample 3 — OpenTelemetry spans wrapped around the agent loop.

Each phase of the agent emits a span. Spans nest naturally: the
conversation has model-call spans inside it, each model call has tool-
call spans for its observations. Exported in standard OTLP so any
tracing backend can render them.

Run:
    pip install opentelemetry-api opentelemetry-sdk opentelemetry-exporter-otlp
    export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
    python 03-trace-export.py
"""

from contextlib import contextmanager

from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.trace import Status, StatusCode

resource = Resource(attributes={"service.name": "trip-planner-agent"})
provider = TracerProvider(resource=resource)
provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter()))
trace.set_tracer_provider(provider)
tracer = trace.get_tracer("trip-planner")


@contextmanager
def span(name: str, **attrs):
    with tracer.start_as_current_span(name) as s:
        for k, v in attrs.items():
            s.set_attribute(k, v)
        try:
            yield s
            s.set_status(Status(StatusCode.OK))
        except Exception as e:
            s.record_exception(e)
            s.set_status(Status(StatusCode.ERROR, str(e)))
            raise


# --- example wrapping around an agent loop ---------------------------------

def run_conversation(user_id: str, conversation_id: str, user_msg: str) -> str:
    with span("agent.conversation",
              user_id=user_id,
              conversation_id=conversation_id,
              input_chars=len(user_msg)) as conv_span:

        # input guardrails
        with span("agent.guardrails_in") as gr_in:
            # ... call into 01-guardrails.py here
            gr_in.set_attribute("blocked", False)

        result_text = ""
        for step in range(8):
            with span("agent.step", step=step) as step_span:

                with span("agent.model_call", model="claude-sonnet-4-6") as mc:
                    # ... actual model call here
                    mc.set_attribute("input_tokens", 1234)
                    mc.set_attribute("output_tokens", 456)
                    mc.set_attribute("cost_usd", 0.0123)
                    is_final = False
                    tool_calls = []  # populated from response

                for tc in tool_calls:
                    with span("agent.tool_call", tool=tc["name"]) as ts:
                        ts.set_attribute("input", str(tc["input"])[:500])
                        # ... run the tool here
                        ts.set_attribute("ok", True)

                if is_final:
                    step_span.set_attribute("terminal", True)
                    break

        # output guardrails
        with span("agent.guardrails_out") as gr_out:
            gr_out.set_attribute("blocked", False)

        conv_span.set_attribute("final_chars", len(result_text))
        return result_text


if __name__ == "__main__":
    out = run_conversation("user-42", "conv-abc", "Plan a weekend in Lisbon, $1200 budget.")
    print(out)
