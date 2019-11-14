import React from 'react';
import {Text, Linking, View, Image} from 'react-native';

import {
  Container,
  Avatar,
  Card,
  Links,
  Author,
  Divider,
  CardContent,
  SocialIcon,
  Icon,
  Role,
} from './styles';

const {staff} = require('~/assets/staff.js');

export default function About() {
  return (
    <Container>
      <View style={{flexDirection: 'row', marginBottom: 20}}>
        <Image
          source={require('../../assets/gallery/logo_uesc_brasao.png')}
          style={{width: 90, height: 120}}
        />
        <Image
          source={require('../../assets/gallery/logo_newnbcgib.png')}
          style={{width: 200, height: 73, marginTop: 30}}
        />
      </View>
      <Text style={{paddingBottom: 20}}>
        Este aplicativo foi desenvolvido por:
      </Text>

      {staff.map(elem => (
        <Card key={elem.author}>
          <Author>{elem.author}</Author>
          <Divider />
          <CardContent>
            <Avatar source={elem.avatar} />
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
