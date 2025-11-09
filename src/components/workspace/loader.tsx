import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { memo } from "react";

export const Loader = memo(() => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Učitavanje scene</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Preuzimamo zadnje transformacije...</p>
      </CardContent>
    </Card>
  </div>
));

Loader.displayName = "Loader";
