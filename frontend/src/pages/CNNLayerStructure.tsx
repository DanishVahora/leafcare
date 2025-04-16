
const CNNLayerStructure = () => {
  const layers = [
    { name: "conv2d", type: "Conv2D", outputShape: [128, 128, 32], params: 896, level: 1 },
    { name: "conv2d_1", type: "Conv2D", outputShape: [128, 128, 32], params: 9248, level: 1 },
    { name: "max_pooling2d", type: "MaxPooling2D", outputShape: [64, 64, 32], params: 0, level: 2 },
    { name: "conv2d_2", type: "Conv2D", outputShape: [64, 64, 64], params: 18496, level: 2 },
    { name: "conv2d_3", type: "Conv2D", outputShape: [64, 64, 64], params: 36928, level: 2 },
    { name: "max_pooling2d_1", type: "MaxPooling2D", outputShape: [32, 32, 64], params: 0, level: 3 },
    { name: "conv2d_4", type: "Conv2D", outputShape: [32, 32, 128], params: 73856, level: 3 },
    { name: "conv2d_5", type: "Conv2D", outputShape: [32, 32, 128], params: 147584, level: 3 },
    { name: "max_pooling2d_2", type: "MaxPooling2D", outputShape: [16, 16, 128], params: 0, level: 4 },
    { name: "conv2d_6", type: "Conv2D", outputShape: [16, 16, 256], params: 295168, level: 4 },
    { name: "conv2d_7", type: "Conv2D", outputShape: [16, 16, 256], params: 590080, level: 4 },
    { name: "max_pooling2d_3", type: "MaxPooling2D", outputShape: [8, 8, 256], params: 0, level: 5 },
    { name: "conv2d_8", type: "Conv2D", outputShape: [8, 8, 512], params: 1180160, level: 5 },
    { name: "conv2d_9", type: "Conv2D", outputShape: [8, 8, 512], params: 2359808, level: 5 },
    { name: "max_pooling2d_4", type: "MaxPooling2D", outputShape: [4, 4, 512], params: 0, level: 6 },
    { name: "dropout", type: "Dropout", outputShape: [4, 4, 512], params: 0, level: 6 },
    { name: "flatten", type: "Flatten", outputShape: [8192], params: 0, level: 7 },
    { name: "dense", type: "Dense", outputShape: [1500], params: 12289500, level: 7 },
    { name: "dropout_1", type: "Dropout", outputShape: [1500], params: 0, level: 7 },
    { name: "dense_1", type: "Dense", outputShape: [38], params: 57038, level: 7 }
  ];

// interface Layer {
//     name: string;
//     type: string;
//     outputShape: number[] | number;
//     params: number;
//     level: number;
// }

const getLayerColor = (type: string): string => {
    const colors: { [key: string]: string } = {
        "Conv2D": "#6366f1",
        "MaxPooling2D": "#10b981",
        "Dropout": "#f59e0b",
        "Flatten": "#ef4444",
        "Dense": "#3b82f6"
    };
    return colors[type] || "#94a3b8";
};

  const logScale = (value: number): number => (value > 0 ? Math.log10(value) * 15 : 0);

  const formatParams = (params: number): string => {
    if (params >= 1000000) {
      return `${(params / 1000000).toFixed(1)}M`;
    } else if (params >= 1000) {
      return `${(params / 1000).toFixed(1)}K`;
    }
    return params.toString();
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">CNN Architecture Visualization</h2>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t pt-4">
        {["Conv2D", "MaxPooling2D", "Dropout", "Flatten", "Dense"].map(type => (
          <div key={type} className="flex items-center">
            <div className="w-5 h-5 rounded-md mr-2" style={{ backgroundColor: getLayerColor(type) }}></div>
            <span className="text-sm font-medium">{type}</span>
          </div>
        ))}
      </div>
      <div className="relative mt-8 flex flex-col gap-4">
        {layers.map((layer, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-32 text-right text-sm">
              <div className="font-medium">{layer.name}</div>
              <div className="text-gray-500 text-xs">
                {Array.isArray(layer.outputShape) 
                  ? `${layer.outputShape.join(' × ')}` 
                  : layer.outputShape}
              </div>
            </div>
            <div 
              className="flex-grow h-12 rounded-lg flex items-center px-4 text-white"
              style={{ 
                backgroundColor: getLayerColor(layer.type),
                width: `${logScale(layer.params) + 20}%`
              }}
            >
              <span className="text-sm font-medium">{formatParams(layer.params)} params</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center text-sm text-gray-600">
        Total parameters: 17,058,762 (65.07 MB)
      </div>
    </div>
  );
};

export default CNNLayerStructure;
