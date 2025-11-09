import { memo } from "react";

type Props = {
  label: string;
  position: [string, string, string];
  rotationDeg: number;
};

export const StatBlocks = memo<Props>(({ position, rotationDeg, label }) => (
  <div className="flex items-center justify-between rounded-md border px-3 py-2">
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-mono text-sm">XYZ: {position.join(", ")}</p>
    </div>
    <div className="text-right">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">rot (y)</p>
      <p className="font-medium">{rotationDeg.toFixed(0)}°</p>
    </div>
  </div>
));

StatBlocks.displayName = "StatBlocks";
