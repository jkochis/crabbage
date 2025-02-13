"use client";
import Card from "./card";
import type { Card as CardType } from "./lib/types";
export default function Cut({ cut }: Readonly<{ cut: CardType | undefined }>) {
  return (
    <div className="cut">
      {cut ? <Card suit={cut.suit} type={cut.type} /> : null}
    </div>
  );
}
