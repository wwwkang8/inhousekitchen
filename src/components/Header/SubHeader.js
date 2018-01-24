import React, { Component } from 'react';
import { Container, Header as NativeHeader, Left, Body, Right, Button, Icon, Title, Text, Content } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import PropTypes from 'prop-types';
import styles from './styles';

class SubHeader extends Component {
  static propsTypes = {
    title: PropTypes.string.isRequired
  };

  static defaultProps = {
    title: 'Header'
  };
  render() {
    const { title } = this.props;

    return (
      <NativeHeader
        style={ styles.headerContainer }
        androidStatusBarColor={ styles.headerContainer._backgroundColor }
        iosBarStyle="light-content">
        <Left>
          <Button transparent>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>{title}</Title>
        </Body>
        <Right />
      </NativeHeader>
    );
  }
}

export default SubHeader;