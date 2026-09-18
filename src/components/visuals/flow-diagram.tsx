import { cn } from "@/lib/utils";
import { revealProps } from "@/lib/reveal";

export interface FlowNode {
  label: string;
  detail?: string;
  /** Emphasised nodes get the accent treatment. */
  accent?: boolean;
}

export interface FlowLayer {
  title?: string;
  nodes: FlowNode[];
}

/**
 * A stacked architecture / process diagram.
 *
 * Built from flex rows and CSS connectors rather than a fixed-size SVG, so it
 * reflows to a single readable column on a phone instead of shrinking into
 * illegibility. The whole thing is real text, which means it is searchable,
 * translatable and readable by a screen reader — the usual failure mode for
 * architecture diagrams is that they are an image.
 */
export function FlowDiagram({
  layers,
  caption,
  className,
}: {
  layers: FlowLayer[];
  caption?: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "rounded-lg border border-hairline bg-surface p-5 sm:p-7",
        className,
      )}
    >
      <ol className="space-y-0">
        {layers.map((layer, layerIndex) => (
          <li key={layer.title ?? layerIndex} {...revealProps(layerIndex * 60)}>
            {layer.title ? (
              <p className="eyebrow mb-2.5">{layer.title}</p>
            ) : null}

            <div
              className={cn(
                "grid gap-2",
                layer.nodes.length === 1 && "grid-cols-1",
                layer.nodes.length === 2 && "grid-cols-2",
                layer.nodes.length === 3 && "grid-cols-1 sm:grid-cols-3",
                layer.nodes.length >= 4 && "grid-cols-2 sm:grid-cols-4",
              )}
            >
              {layer.nodes.map((node) => (
                <div
                  key={node.label}
                  className={cn(
                    "rounded-md border px-3 py-3 text-center",
                    node.accent
                      ? "border-accent bg-accent-soft"
                      : "border-hairline bg-canvas",
                  )}
                >
                  <p
                    className={cn(
                      "text-[0.875rem] font-medium leading-snug",
                      node.accent ? "text-accent-text" : "text-ink",
                    )}
                  >
                    {node.label}
                  </p>
                  {node.detail ? (
                    <p className="mt-1 text-[0.75rem] leading-snug text-ink-subtle">
                      {node.detail}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>

            {layerIndex < layers.length - 1 ? (
              <div
                aria-hidden="true"
                className="flex items-center justify-center py-2.5"
              >
                <span className="relative flex h-6 w-px bg-hairline-strong">
                  <span className="absolute -bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 rotate-45 border-b border-r border-hairline-strong" />
                </span>
              </div>
            ) : null}
          </li>
        ))}
      </ol>

      {caption ? (
        <figcaption className="mt-5 border-t border-hairline pt-4 text-[0.8125rem] leading-relaxed text-ink-subtle">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Horizontal journey — used for funnels and pipelines. */
export function FlowSteps({
  steps,
  className,
}: {
  steps: FlowNode[];
  className?: string;
}) {
  return (
    <ol
      className={cn(
        "grid gap-3 sm:grid-flow-col sm:auto-cols-fr",
        className,
      )}
    >
      {steps.map((step, index) => (
        <li
          key={step.label}
          {...revealProps(index * 60)}
          className="relative flex flex-col rounded-md border border-hairline bg-surface p-4"
        >
          <span className="numeric font-mono text-[0.6875rem] tracking-[0.14em] text-accent-text">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="mt-2 text-[0.9375rem] font-medium text-ink">
            {step.label}
          </span>
          {step.detail ? (
            <span className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-muted">
              {step.detail}
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
