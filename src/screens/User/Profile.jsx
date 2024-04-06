import * as React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';


function Profile() {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://scontent.fsgn2-4.fna.fbcdn.net/v/t39.30808-6/431378401_1108818896833173_234506770613680545_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHF6S2jNSQBXHdecKZNJihSJs2cS8OW5AImzZxLw5bkAsj4dNJyZQ8-By7zNHIbTEUhcj01SRYDozw36aaciPWb&_nc_ohc=VNMLZ2MLEl4AX8j6M2p&_nc_oc=AQnGbTfg1Y-mUWvvrRadyhhdYcUYOqBeYrNXwNdHRQ2w1UAnUIhznUDHpvovQ5rgUvM&_nc_ht=scontent.fsgn2-4.fna&oh=00_AfCu0xIGLw74y9leK4spsaM4GwRNRaCNCOwprrAFbhVp1w&oe=65EEFF4B' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>ĐỖ THẾ SƠN</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>Sondtgcd191140</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Location:</Text>
        <Text style={styles.infoValue}>VietNam</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Bio:</Text>
        <Text style={styles.infoValue}>HEHE SONDZ</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  infoValue: {
    marginTop: 5,
  },
});


export default Profile;