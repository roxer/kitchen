import type { App, DirectiveBinding } from "vue";
import { Tooltip } from "bootstrap";

interface TooltipOptions {
  title?: string;
  placement?: "auto" | "top" | "bottom" | "left" | "right";
  trigger?: "click" | "hover" | "focus" | "manual" | string;
  html?: boolean;
  delay?: number | { show?: number; hide?: number };
  animation?: boolean;
  container?: string | HTMLElement | false;
  fallbackPlacements?: string[];
  boundary?: string | HTMLElement;
  sanitize?: boolean;
  sanitizeFn?: (input: string) => string;
  allowList?: Record<string, string[]>;
  offset?:
    | number
    | string
    | ((
        fn: (options: { popper: any; reference: any }) => number[]
      ) => number[]);
  popperConfig?: Record<string, any>;
  [key: string]: any;
}

const tooltipInstances = new WeakMap<HTMLElement, Tooltip>();

function getTooltipOptions(value: string | TooltipOptions): TooltipOptions {
  if (typeof value === "string") {
    return { title: value };
  }
  return value;
}

function initTooltip(
  el: HTMLElement,
  binding: DirectiveBinding<string | TooltipOptions>
) {
  const options = getTooltipOptions(binding.value);

  // Dispose existing tooltip if any
  const existingTooltip = tooltipInstances.get(el);
  if (existingTooltip) {
    existingTooltip.dispose();
    tooltipInstances.delete(el);
  }

  // Initialize Bootstrap tooltip with options
  const tooltip = new Tooltip(el, options);
  tooltipInstances.set(el, tooltip);
}

function destroyTooltip(el: HTMLElement) {
  const tooltip = tooltipInstances.get(el);
  if (tooltip) {
    tooltip.dispose();
    tooltipInstances.delete(el);
  }
}

export const vTooltip = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | TooltipOptions>) {
    initTooltip(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding<string | TooltipOptions>) {
    initTooltip(el, binding);
  },
  unmounted(el: HTMLElement) {
    destroyTooltip(el);
  },
};

export function setupTooltipDirective(app: App) {
  app.directive("tooltip", vTooltip);
}
