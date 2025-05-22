import ButtonHov from "@/components/tailwind-custom/ButtonHov.tsx";

const PageNotFound = () => {
  return (
    <div className="w-full py-24 flex flex-col gap-3 items-center justify-center">
      <img
        src="../src/assets/EmptyBox.png"
        alt="Page Not Found"
        width={100}
        height={100}
      />
      <h1 className="font-extrabold text-3xl">404 Page not found </h1>
      <p className="text-md text-gray-500">
        The page you requested does not exist.
      </p>
      <ButtonHov Title="Click to return Daskboand" classCustom="px-2" />
    </div>
  );
};

export default PageNotFound;
