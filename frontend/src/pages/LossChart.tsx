import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LossChart = () => {
  const data = [
    { epoch: 1, trainLoss: 1.8240, valLoss: 0.3419 },
    { epoch: 2, trainLoss: 0.3765, valLoss: 0.2138 },
    { epoch: 3, trainLoss: 0.2249, valLoss: 0.1663 },
    { epoch: 4, trainLoss: 0.1533, valLoss: 0.1500 },
    { epoch: 5, trainLoss: 0.1103, valLoss: 0.1593 },
    { epoch: 6, trainLoss: 0.0870, valLoss: 0.1081 },
    { epoch: 7, trainLoss: 0.0727, valLoss: 0.1230 },
    { epoch: 8, trainLoss: 0.0598, valLoss: 0.1030 },
    { epoch: 9, trainLoss: 0.0560, valLoss: 0.1020 },
    { epoch: 10, trainLoss: 0.0521, valLoss: 0.1103 },
  ];

  return (
    <div className="w-full h-96 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Model Loss Over Training Epochs</h2>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="epoch" label={{ value: 'Epoch', position: 'insideBottomRight', offset: -5 }} />
          <YAxis domain={[0, 2]} label={{ value: 'Loss', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value) => typeof value === 'number' ? value.toFixed(4) : value} />
          <Legend />
          <Line type="monotone" dataKey="trainLoss" name="Training Loss" stroke="#ff8042" strokeWidth={2} />
          <Line type="monotone" dataKey="valLoss" name="Validation Loss" stroke="#0088FE" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LossChart;