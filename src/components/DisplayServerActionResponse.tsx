type Props = {
  result: {
    data?: {
      message?: string;
    };
    serverError?: string;
    validationErrors?: Record<string, string[] | undefined>;
  };
};

const MessageBox = ({
  type,
  content,
}: {
  type: "success" | "error" | "warning" | "info";
  content: React.ReactNode;
}) => {
  return (
    <div
      className={`p-4 rounded-md text-gray-700 ${
        type === "success"
          ? "bg-green-200"
          : type === "error"
          ? "bg-red-200"
          : type === "warning"
          ? "bg-yellow-200"
          : "bg-blue-200"
      }`}
    >
      {content}
    </div>
  );
};

export function DisplayServerActionResponse({ result }: Props) {
  const { data, serverError, validationErrors } = result;
  return (
    <div>
      {data?.message && (
        <MessageBox type="success" content={`Success: ${data.message}`} />
      )}
      {serverError && (
        <MessageBox type="error" content={`Error: ${serverError}`} />
      )}
      {validationErrors && (
        <MessageBox
          type="error"
          content={Object.keys(validationErrors || {}).map((key) => (
            <div key={key}>
              <p>
                {`${key}: ${
                  validationErrors[key as keyof typeof validationErrors]
                }` || ""}
              </p>
            </div>
          ))}
        />
      )}
    </div>
  );
}
