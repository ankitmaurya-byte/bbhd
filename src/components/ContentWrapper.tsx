import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ContentWrapper = ({
  children,
  className,
}: Props & { className?: string }) => {
  return (
    <div className={`w-full max-w-[1200px] mx-auto px-5 ${className || ""}`}>
      {children}
    </div>
  );
};

export default ContentWrapper;
