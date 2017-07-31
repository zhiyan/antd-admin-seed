import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Affix , Row, Col} from 'antd';

import NavPath from '../../components/NavPath'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import Footer from '../../components/Footer'
import {fetchProfile, logout} from '../../actions/user';

import {getCookie} from '../../utils'

// import 'antd/dist/antd.less';
import './theme.less';
import './index.scss';

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {actions} = this.props;
    actions.fetchProfile();
  }

  render() {
    const {user, actions} = this.props;

    const isHome = this.props.location.pathname === '/home'

    return (
      <div className="ant-layout-aside">
        <Header user={user} />
        <div className="ant-layout-main">
          <Sidebar />
          <NavPath  {...this.props} />
          <div className="ant-layout-container">
            {isHome ? this.props.children : <div className="ant-layout-content">
              {this.props.children}
            </div>}
            
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node.isRequired,
};

App.contextTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  const {user} = state;
  return {
      user: user ? user : null,
  };
};

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({fetchProfile, logout, getCity}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
