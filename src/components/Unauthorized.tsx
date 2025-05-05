interface UnauthorizedProps {
  asset: string;
}
export default function Unauthorized({ asset }: UnauthorizedProps) {
  return (
    <div className="h-full flex flex-col justify-center">
      <h1>Sorry! Only Cowboys can view {asset}.</h1>
    </div>
  );
}
