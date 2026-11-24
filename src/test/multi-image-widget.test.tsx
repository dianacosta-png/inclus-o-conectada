import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";

function loadControl() {
  let Control: React.ComponentType<any> | undefined;
  const host = {
    CMS: { registerWidget: vi.fn((_name, control) => { Control = control; }) },
    h: React.createElement,
    heic2any: (globalThis as any).heic2any,
    createClass: (spec: any) => {
      class Widget extends React.Component<any, any> {
        constructor(props: any) {
          super(props);
          Object.keys(spec).forEach((key) => { (this as any)[key] = spec[key].bind(this); });
          this.state = spec.getInitialState?.call(this) ?? {};
        }
        render() { return spec.render.call(this); }
      }
      return Widget;
    },
  };
  new Function("window", readFileSync("public/admin/multi-image-widget.js", "utf8"))(host);
  if (!Control) throw new Error("Widget was not registered");
  return Control;
}

const field = { get: (k: string) => ({ public_folder: "/fotos/uploads" } as Record<string, string>)[k] };

function select(container: HTMLElement, files: File[]) {
  const input = container.querySelector("input");
  if (!input) throw new Error("Missing selection input");
  fireEvent.change(input, { target: { files } });
}

describe("administrative gallery", () => {
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

  it("selects several photos, removes one, and keeps existing URLs when adding", async () => {
    vi.stubGlobal("URL", { createObjectURL: vi.fn((f: File) => `blob:${f.name}`), revokeObjectURL: vi.fn() });
    const Control = loadControl();
    const persist = vi.fn().mockResolvedValue({ type: "ADD_DRAFT_ENTRY_MEDIA_FILE" });
    const changed = vi.fn();
    const { container } = render(<Control value={["/fotos/existing.jpg"]} onChange={changed} onPersistMedia={persist} field={field} />);
    const files = [new File(["a"], "a.jpg", { type: "image/jpeg" }), new File(["b"], "b.jpg", { type: "image/jpeg" })];
    select(container, files);
    await screen.findByRole("button", { name: "Adicionar 2 foto(s)" });
    fireEvent.click(screen.getAllByTitle("Remover")[0]);
    fireEvent.click(await screen.findByRole("button", { name: "Adicionar 1 foto(s)" }));
    await waitFor(() => expect(changed).toHaveBeenCalledTimes(1));
    expect(persist).toHaveBeenCalledTimes(1);
    expect(persist.mock.calls[0][0].name).toMatch(/-b\.jpg$/);
    expect(persist.mock.calls[0][1]).toEqual({ field });
    expect(changed.mock.calls[0][0]).toEqual(["/fotos/existing.jpg", `/fotos/uploads/${persist.mock.calls[0][0].name}`]);
  });

  it("shows a clear message and keeps the photo when adding fails", async () => {
    vi.stubGlobal("URL", { createObjectURL: vi.fn((f: File) => `blob:${f.name}`), revokeObjectURL: vi.fn() });
    const Control = loadControl();
    const persist = vi.fn().mockResolvedValue({ type: "MEDIA_PERSIST_FAILURE" });
    const changed = vi.fn();
    const { container } = render(<Control value={[]} onChange={changed} onPersistMedia={persist} field={field} />);
    select(container, [new File(["c"], "festa.jpg", { type: "image/jpeg" })]);
    fireEvent.click(await screen.findByRole("button", { name: "Adicionar 1 foto(s)" }));
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain('Não foi possível adicionar a foto "festa.jpg"');
    expect(changed).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Adicionar 1 foto(s)" })).toBeTruthy();
  });

  it("rejects photos larger than 10 MB with a clear message", async () => {
    vi.stubGlobal("URL", { createObjectURL: vi.fn(() => "blob:big"), revokeObjectURL: vi.fn() });
    const Control = loadControl();
    const persist = vi.fn();
    const { container } = render(<Control value={[]} onChange={vi.fn()} onPersistMedia={persist} field={field} />);
    const big = new File([new Uint8Array(11 * 1024 * 1024)], "grande.gif", { type: "image/gif" });
    select(container, [big]);
    fireEvent.click(await screen.findByRole("button", { name: "Adicionar 1 foto(s)" }));
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("O limite é 10 MB por foto");
    expect(persist).not.toHaveBeenCalled();
  });

  it("converts HEIC photos to JPG before adding", async () => {
    vi.stubGlobal("URL", { createObjectURL: vi.fn(() => "blob:x"), revokeObjectURL: vi.fn() });
    const heic2any = vi.fn().mockResolvedValue(new Blob(["j"], { type: "image/jpeg" }));
    vi.stubGlobal("heic2any", heic2any);
    const Control = loadControl();
    const persist = vi.fn().mockResolvedValue({});
    const changed = vi.fn();
    const { container } = render(<Control value={[]} onChange={changed} onPersistMedia={persist} field={field} />);
    select(container, [new File(["h"], "IMG_1.HEIC", { type: "" })]);
    fireEvent.click(await screen.findByRole("button", { name: "Adicionar 1 foto(s)" }));
    await waitFor(() => expect(changed).toHaveBeenCalledTimes(1));
    expect(heic2any).toHaveBeenCalledTimes(1);
    expect(persist.mock.calls[0][0].name).toMatch(/-img-1\.jpg$/);
    expect(persist.mock.calls[0][0].type).toBe("image/jpeg");
  });
});
