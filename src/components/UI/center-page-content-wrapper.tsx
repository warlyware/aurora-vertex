import CenterContentWrapper from "@/components/UI/center-content-wrapper";

export default function CenterPageContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CenterContentWrapper className="-mt-16">{children}</CenterContentWrapper>
  );
}
