import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AccuracyChart = () => {
  const data = [
    { epoch: 1, trainAccuracy: 0.4847, valAccuracy: 0.8903 },
    { epoch: 2, trainAccuracy: 0.8794, valAccuracy: 0.9295 },
    { epoch: 3, trainAccuracy: 0.9289, valAccuracy: 0.9456 },
    { epoch: 4, trainAccuracy: 0.9477, valAccuracy: 0.9509 },
    { epoch: 5, trainAccuracy: 0.9634, valAccuracy: 0.9497 },
    { epoch: 6, trainAccuracy: 0.9712, valAccuracy: 0.9651 },
    { epoch: 7, trainAccuracy: 0.9770, valAccuracy: 0.9626 },
    { epoch: 8, trainAccuracy: 0.9798, valAccuracy: 0.9693 },
    { epoch: 9, trainAccuracy: 0.9816, valAccuracy: 0.9687 },
    { epoch: 10, trainAccuracy: 0.9835, valAccuracy: 0.9700 },
  ];

  return (
    <div className="w-full h-96 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Model Accuracy Over Training Epochs</h2>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="epoch" label={{ value: 'Epoch', position: 'insideBottomRight', offset: -5 }} />
          <YAxis domain={[0.4, 1]} label={{ value: 'Accuracy', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value) => typeof value === 'number' ? value.toFixed(4) : value} />
          <Legend />
          <Line type="monotone" dataKey="trainAccuracy" name="Training Accuracy" stroke="#8884d8" strokeWidth={2} />
          <Line type="monotone" dataKey="valAccuracy" name="Validation Accuracy" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccuracyChart;