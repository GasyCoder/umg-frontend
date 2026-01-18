declare module "marked" {
  export const marked: {
    parse: (markdown: string) => string;
  };
}

declare module "@tiptap/extension-text-align" {
  const TextAlign: any;
  export default TextAlign;
}

