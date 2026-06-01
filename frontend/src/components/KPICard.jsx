import React from 'react';
import './KPICard.css';

const KPICard = ({ title, value, icon, trend, trendType = "neutral", color = "primary" }) => {
  return (
    <div className={`kpi-card card flex justify-between align-center border-${color}`}>
      <div className="kpi-info flex flex-col">
        <span className="kpi-title">{title}</span>
        <span className="kpi-value">{value}</span>
        {trend && (
          <span className={`kpi-trend trend-${trendType}`}>
            {trendType === 'up' ? '↗' : trendType === 'down' ? '↘' : '→'} {trend}
          </span>
        )}
      </div>
      <div className={`kpi-icon-container bg-${color}`}>
        <span className="kpi-icon">{icon}</span>
      </div>
    </div>
  );
};

export default KPICard;
