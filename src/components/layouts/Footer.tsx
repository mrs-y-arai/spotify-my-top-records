import { CREATED_YEAR } from "~/constants";

export default function Footer() {
  const year = new Date().getFullYear();
  const copyRightYear = () => {
    if (year === CREATED_YEAR) return year;

    return `${CREATED_YEAR} - ${year}`;
  };

  return (
    <>
      <footer className="w-screen bg-black py-3 px-5 text-center">
        <small>&copy; {copyRightYear()} Yuki Arai</small>
      </footer>
    </>
  );
}
