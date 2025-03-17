function RequiredField({ message }: { message?: string }) {
  return (
    <p
      className="m-0 w-full items-start text-sm text-red-600 mb-2"
      role="alert"
    >
      *{message}
    </p>
  );
}

export default RequiredField;
