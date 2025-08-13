import type { ProgressInfo } from "$types/custom-resources";
import prettyMilliseconds from "pretty-ms";

export function updateProgressBar(progress: ProgressInfo): void {
  const percentage = Math.round((progress.current / progress.total) * 100);
  const barLength = 40;
  const filledLength = Math.round((percentage / 100) * barLength);
  const bar = "█".repeat(filledLength) + "░".repeat(barLength - filledLength);

  const elapsed = Date.now() - progress.startTime;
  const rate = progress.current / (elapsed / 1000);
  const eta = progress.current > 0 ? ((progress.total - progress.current) / rate) * 1000 : 0;

  process.stdout.write("\r\x1b[2K");

  const progressLine = `\x1b[36m[${progress.packName}]\x1b[0m ` + `\x1b[32m${bar}\x1b[0m ` + `\x1b[33m${percentage}%\x1b[0m ` + `(\x1b[34m${progress.current}\x1b[0m/\x1b[34m${progress.total}\x1b[0m) ` + `\x1b[90m|\x1b[0m ` + `ETA: \x1b[35m${prettyMilliseconds(eta)}\x1b[0m ` + `\x1b[90m|\x1b[0m `;
  /// progressLine += `Errors: \x1b[31m${progress.errors}\x1b[0m`;

  if (progress.current < progress.total) {
    const rateInfo = ` \x1b[90m|\x1b[0m \x1b[90m${rate.toFixed(1)} files/s\x1b[0m`;
    process.stdout.write(progressLine + rateInfo);
  } else {
    process.stdout.write(progressLine);
  }
}
