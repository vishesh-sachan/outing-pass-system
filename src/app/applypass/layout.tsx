import StudentNavbar from "@/components/StudentNavbar";

export default function ApplyPassLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <StudentNavbar />
          {children}
      </body>
    </html>
  );
}
