function InformationCard({
  heading,
  data,
}: {
  heading: string;
  data: string | number | undefined;
}) {
  return (
    <div className="flex gap-2">
      <p className="font-semibold">{heading} :</p>
      <p>{data}</p>
    </div>
  );
}

export default InformationCard;
