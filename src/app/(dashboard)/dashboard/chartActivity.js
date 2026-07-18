import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  {
    name: 'Jan',
    uv: 4000,
    pv: 1100,
    amt: 2400,
  },
  {
    name: 'Feb',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Mar',
    uv: 2000,
    pv: 1000,
    amt: 2290,
  },
  {
    name: 'Apr',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'May',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Jun',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Jul',
    uv: 3490,
    pv: 1000,
    amt: 2100,
  },
];

const MyAreaChart = () => {
  return (
    <div className='bg-white dark:bg-[#08120e] border border-gray-100 dark:border-white/5 rounded-3xl p-8 [&_.recharts-wrapper]:outline-none [&_.recharts-wrapper]:focus:outline-none [&_.recharts-surface]:outline-none [&_.recharts-surface]:focus:outline-none **:focus:outline-none' style={{ width: '100%', height: 400, padding: '20px' }}>
      <ResponsiveContainer width="100%" height="100%" >
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
           onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          style={{ outline: 'none' }}
        >
          <XAxis dataKey="name"/>
          <YAxis  axisLine={{style: {outline: 'none'}}}/>
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey="uv" 
            stackId="1"
            stroke="#8884d8" 
            fill="#8884d8" 
            fillOpacity={0.3}
            className='focus:outline-none'
          />
          <Area 
            type="monotone" 
            dataKey="pv" 
            stackId="1"
            stroke="#82ca9d" 
            fill="#82ca9d" 
            fillOpacity={0.3}
            
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MyAreaChart;


