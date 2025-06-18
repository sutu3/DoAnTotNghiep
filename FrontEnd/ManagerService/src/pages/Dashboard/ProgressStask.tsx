import {
  CircularProgress,
  Card,
  CardBody,
  CardFooter,
  Chip,
  CardHeader,
} from "@heroui/react";

const ProgressStack = () => {
  return (
    <Card className="bg-gradient-to-br from-green-200 to-yellow-300 rounded-2xl shadow-lg text-white overflow-hidden">
      {/* Header */}
      <CardHeader className="text-center text-xl font-bold font-mono tracking-wide py-4 border-b border-white/30">
        Section 5 Usage
      </CardHeader>

      {/* Circular Progress */}
      <CardBody className="flex flex-col items-center justify-center py-6">
        <CircularProgress
          classNames={{
            svg: "w-36 h-36 drop-shadow-md",
            indicator: "stroke-white",
            track: "stroke-white/10",
            value: "text-3xl font-semibold text-white",
          }}
          showValueLabel={true}
          strokeWidth={4}
          value={70}
        />
        <p className="mt-4 text-lg font-semibold">Location Used</p>
      </CardBody>

      {/* Footer: Info Chips */}
      <CardFooter className="flex flex-col gap-2 items-center justify-center pb-6">
        <Chip
          classNames={{
            base: "bg-white/10 backdrop-blur border border-white/20 px-4 py-2 rounded-full",
            content: "text-white font-medium text-sm",
          }}
          variant="bordered"
        >
          Loaded: <span className="ml-1 font-bold">19 Shelves</span>
        </Chip>
        <Chip
          classNames={{
            base: "bg-white/10 backdrop-blur border border-white/20 px-4 py-2 rounded-full",
            content: "text-white font-medium text-sm",
          }}
          variant="bordered"
        >
          Empty: <span className="ml-1 font-bold">64 Shelves</span>
        </Chip>
      </CardFooter>
    </Card>
  );
};

export default ProgressStack;
