import Container from "./Container";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-white">
      <Container>
        <div className="py-10 text-sm text-slate-600">
          © {new Date().getFullYear()} Université de Mahajanga — Service TIC
        </div>
      </Container>
    </footer>
  );
}