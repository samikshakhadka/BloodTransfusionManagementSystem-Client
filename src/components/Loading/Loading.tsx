import CircularProgress from '@mui/material/CircularProgress';

export default function Loading() {
  return (
    <div className="flex h-100vh w-100vw items-center justify-center ">
      <CircularProgress />
    </div>
  );
}
