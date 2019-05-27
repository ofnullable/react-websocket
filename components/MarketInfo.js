import React, { memo } from 'react';
import { ListItem, Avatar, ListItemText } from '@material-ui/core';
import {
  TrendingDownOutlined,
  TrendingUpOutlined,
  TrendingFlatOutlined,
} from '@material-ui/icons';

const MarketInfo = memo(({ market }) => {
  const formatNumber = amount => {
    return `${amount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <ListItem>
      <Avatar style={{ backgroundColor: 'transparent' }}>
        {market.data ? (
          market.data.change_rate < 0 ? (
            <TrendingDownOutlined style={{ color: 'blue' }} />
          ) : (
            <TrendingUpOutlined style={{ color: 'red' }} />
          )
        ) : (
          <TrendingFlatOutlined style={{ color: 'grey' }} />
        )}
      </Avatar>
      <ListItemText
        primary={
          market.data
            ? `${market.name} - ${formatNumber(market.data.amount)}`
            : `${market.name} - No data`
        }
        secondary={
          market.data
            ? `current price: ${formatNumber(market.data.price)} change rate: ${
                market.data.change_rate
              }`
            : `No data`
        }
      />
    </ListItem>
  );
});

export default MarketInfo;
