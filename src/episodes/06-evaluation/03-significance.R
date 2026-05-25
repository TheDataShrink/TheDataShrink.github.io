# Episode 6, sample 3 — bootstrap confidence intervals for score deltas.
#
# Given paired scores from two agent versions on the same fixtures,
# resample with replacement and produce a 95% CI for the mean delta.
# If the CI crosses zero, you cannot claim the new version is better.
#
# Run:
#   Rscript 03-significance.R scores.csv
#
# Expected CSV columns:
#   fixture_id, version, score
# where 'version' is either "old" or "new".

suppressMessages(library(boot))

args <- commandArgs(trailingOnly = TRUE)
csv_path <- if (length(args) >= 1) args[1] else "scores.csv"

scores <- read.csv(csv_path, stringsAsFactors = FALSE)
stopifnot(all(c("fixture_id", "version", "score") %in% names(scores)))
stopifnot(all(scores$version %in% c("old", "new")))

# paired delta: per fixture, compute new - old, bootstrap the mean
paired <- merge(
  subset(scores, version == "old")[, c("fixture_id", "score")],
  subset(scores, version == "new")[, c("fixture_id", "score")],
  by = "fixture_id", suffixes = c("_old", "_new")
)
paired$delta <- paired$score_new - paired$score_old

delta_stat <- function(d, idx) mean(d$delta[idx])
set.seed(42)
b <- boot(paired, delta_stat, R = 2000)
ci <- boot.ci(b, type = "perc")

mean_delta <- b$t0
lower <- ci$percent[4]
upper <- ci$percent[5]

cat(sprintf("n fixtures     : %d\n", nrow(paired)))
cat(sprintf("mean delta     : %.4f\n", mean_delta))
cat(sprintf("95%% CI         : [%.4f, %.4f]\n", lower, upper))

verdict <- if (lower > 0)         "NEW is better (CI above zero)"
           else if (upper < 0)    "OLD is better (CI below zero)"
           else                   "INCONCLUSIVE (CI crosses zero) — do not claim improvement"
cat("verdict        :", verdict, "\n")

# Also report effect size in standard deviations of the delta — useful
# for spotting "statistically significant but trivially small" deltas.
sd_delta <- sd(paired$delta)
cat(sprintf("effect size    : %.3f SDs of delta\n", mean_delta / sd_delta))
