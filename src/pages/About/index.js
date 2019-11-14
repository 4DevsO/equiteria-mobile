import React from 'react';
import {Text, Linking} from 'react-native';

import {
  Container,
  Image,
  Card,
  Links,
  Author,
  Divider,
  CardContent,
  SocialIcon,
  Icon,
  Role,
} from './styles';
import {View} from 'react-native';

const {staff} = require('~/assets/staff.js');

export default function About() {
  return (
    <Container>
      <Text style={{paddingBottom: 20}}>
        Este aplicativo foi desenvolvido por:
      </Text>

      {staff.map(elem => (
        <Card>
          <Author>{elem.author}</Author>
          <Divider />
          <CardContent>
            <Image source={elem.avatar} />
            <View>
              <Role>{elem.role}</Role>
              <Links>
                <SocialIcon
                  icon={<Icon name="github" />}
                  onPress={() =>
                    Linking.openURL(elem.gitHub).catch(e =>
                      console.log('<error>', e),
                    )
                  }
                />
                <SocialIcon
                  icon={<Icon name="linkedin-square" />}
                  onPress={() =>
                    Linking.openURL(elem.linkedIn).catch(e =>
                      console.log('<error>', e),
                    )
                  }
                />
                <SocialIcon
                  icon={<Icon name="mail" />}
                  onPress={() =>
                    Linking.openURL('mailto:' + elem.email).catch(e =>
                      console.log('<error>', e),
                    )
                  }
                />
              </Links>
            </View>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}

About.navigationOptions = {
  title: 'Sobre',
};
