import React from 'react';
import './KPICard.css';

const KPICard = ({
  title,
  value,
  unit = '',
  trend = null,
  trendLabel = '',
  icon = null,
  color = 'primary',
  subtitle = null,
  onClick = null
}) => {
  const getTrendIcon = () => {
    if (trend > 0) return '↗';
    if (trend < 0) return '↘';
    return '→';
  };

  const getTrendColor = () => {
    if (trend > 0) return 'success';
    if (trend < 0) return 'error';
    return 'neutral';
  };

  return (
    <div
      className={`kpi-card kpi-${color} ${onClick ? 'kpi-clickable' : ''}`}
      onClick={onClick}
    >
      <div className="kpi-header">
        <div className="kpi-icon">{icon}</div>
        <div className="kpi-title-group">
          <h4 className="kpi-title">{title}</h4>
          {subtitle && <p className="kpi-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="kpi-body">
        <div className="kpi-value-row">
          <span className="kpi-value">{value}</span>
          {unit && <span className="kpi-unit">{unit}</span>}
        </div>

        {trend !== null && (
          <div className={`kpi-trend kpi-trend-${getTrendColor()}`}>
            <span className="kpi-trend-icon">{getTrendIcon()}</span>
            <span className="kpi-trend-value">
              {trend > 0 ? '+' : ''}{trend}%
            </span>
            {trendLabel && <span className="kpi-trend-label">{trendLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
