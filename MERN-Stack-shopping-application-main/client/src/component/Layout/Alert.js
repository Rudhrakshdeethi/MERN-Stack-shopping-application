import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts }) =>
  alerts.length > 0 ? (
    <div className="alert-stack">
      {alerts.map((alert) => (
        <div key={alert.id} className={`alert alert-${alert.alertType} fade-in-up`} role="alert">
          {alert.msg}
        </div>
      ))}
    </div>
  ) : null;

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
