import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

function loadControl() {
  let Control: React.ComponentType<any> | undefined;
  const registerWidget = vi.fn((_name, control) => { Control = control; });
  const host = {
    CMS: { registerWidget }, h: React.createElement,
    createClass: (spec: any) => {
      class Widget extends React.Component<any, any> {
        constructor(props: any) {
          super(props);
          Object.keys(spec).forEach((key) => {
            (this as any)[key] = spec[key].bind(this);
          });
          this.state = spec.getInitialState?.call(this) ?? {};
        }
        render() { return spec.render.call(this); }
      }
      return Widget;
    },
    netlifyIdentity: { currentUser: () => ({ jwt: async () => "test-token" }) },
  };
  new Function("window", readFileSync("public/admin/multi-image-widget.js", "utf8"))(host);
  if (!Control) throw new Error("Widget was not registered");
  return Control;
}

describe("administrative gallery", () => {
  it("selects several photos, removes one, and preserves existing URLs when uploading", async () => {
    const createURL = vi.fn((file: File) => `blob:${file.name}`);
    vi.stubGlobal("URL", { createObjectURL: createURL, revokeObjectURL: vi.fn() });
    const upload = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", upload);
    const Control = loadControl();
    const changed = vi.fn();
    const { container } = render(<Control value={["/fotos/existing.jpg"]} onChange={changed} />);
    const input = container.querySelector("input");
    if (!input) throw new Error("Missing selection input");
    const files = [new File(["a"], "a.jpg", { type: "image/jpeg" }), new File(["b"], "b.jpg", { type: "image/jpeg" })];
    fireEvent.change(input, { target: { files } });
    expect(createURL).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getAllByTitle("Remover")[0]);
    fireEvent.click(screen.getByRole("button", { name: "Enviar 1 foto(s)" }));
    await waitFor(() => expect(changed).toHaveBeenCalledTimes(1));
    expect(upload).toHaveBeenCalledTimes(1);
    expect(changed.mock.calls[0][0]).toEqual(["/fotos/existing.jpg", expect.stringMatching(/^\/fotos\/uploads\/.*-b\.jpg$/)]);
    vi.unstubAllGlobals();
  });
});