<View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'space-between',
              }}>
              <View style={{ flexDirection: 'row' }}>
                {/* <Image
                  source={require('../assets/halfsun.png')}
                  style={{ width: 30, height: 18, marginTop: 5 }}
                /> */}
                <Text
                  style={{
                    color: 'black',
                    fontSize: 18,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {' '}
                  Morning{' '}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  morning ? setMorning(false) : setMorning(true);
                }}>
                <AntDesign
                  name={morning ? 'upcircle' : 'downcircle'}
                  style={{ color: 'grey' }}
                  size={15}
                />
              </TouchableOpacity>
            </View>
  
            {morning ? (
              <View style={{ marginTop: 15 }}>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: 'grey',
                    marginBottom: 10,
                  }}
                />
                <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
                  {morningSlots.map((slot, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => returntime(slot.end, slot.start)}
                      >
                        <View
                          style={[
                            {
                              borderWidth: 1,
                              borderColor: 'grey',
                              borderRadius: 40,
                              marginHorizontal: 10,
                              marginTop: 10,
                              // backgroundColor:'red'
                            },
                            {
                              backgroundColor:
                                selectedEndSlot === slot.end &&
                                  selectedStartSlot == slot.start
                                  ? '#175CA4'
                                  : 'white',
                            },
                          ]}>
                          <Text
                            key={index}
                            style={[
                              {
                                color: 'black',
                                marginHorizontal: 14,
                                fontSize: 12,
                                marginVertical: 7,
                                fontFamily: 'Poppins-Regular',
                              },
                              {
                                color:
                                  selectedEndSlot === slot.end &&
                                    selectedStartSlot == slot.start
                                    ? 'white'
                                    : 'black',
                              },
                            ]}>
                            {slot.start} - {slot.end}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>
            ) : null}
  
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                justifyContent: 'space-between',
              }}>
              <View style={{ flexDirection: 'row' }}>
                {/* <Image
                  source={require('../assets/sun.png')}
                  style={{ width: 30, height: 30 }}
                /> */}
                <Text
                  style={{
                    color: 'black',
                    fontSize: 18,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {' '}
                  Day{' '}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  day ? setDay(false) : setDay(true);
                }}>
                <AntDesign
                  name={day ? 'upcircle' : 'downcircle'}
                  style={{ color: 'grey' }}
                  size={15}
                />
              </TouchableOpacity>
            </View>
  
            {day ? (
              <View style={{ marginTop: 15 }}>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: 'grey',
                    marginBottom: 10,
                  }}
                />
                <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
                  {daySlots.map((slot, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => returntime(slot.end, slot.start)}
                      >
                        <View
                          style={[
                            {
                              borderWidth: 1,
                              borderColor: 'grey',
                              borderRadius: 40,
                              marginHorizontal: 10,
                              marginTop: 10,
                              // backgroundColor:'red'
                            },
                            {
                              backgroundColor:
                                selectedEndSlot === slot.end &&
                                  selectedStartSlot == slot.start
                                  ? '#175CA4'
                                  : 'white',
                            },
                          ]}>
                          <Text
                            key={index}
                            style={[
                              {
                                color: 'black',
                                marginHorizontal: 14,
                                fontSize: 12,
                                marginVertical: 7,
                                fontFamily: 'Poppins-Regular',
                              },
                              {
                                color:
                                  selectedEndSlot === slot.end &&
                                    selectedStartSlot == slot.start
                                    ? 'white'
                                    : 'black',
                              },
                            ]}>
                            {slot.start} - {slot.end}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>
            ) : null}
  
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                justifyContent: 'space-between',
              }}>
              <View style={{ flexDirection: 'row' }}>
                {/* <Image
                  source={require('../assets/moon.png')}
                  style={{ width: 24, height: 28, marginLeft: 5 }}
                /> */}
                <Text
                  style={{
                    color: 'black',
                    fontSize: 18,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {' '}
                  Night{' '}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  night ? setNight(false) : setNight(true);
                }}>
                <AntDesign
                  name={night ? 'upcircle' : 'downcircle'}
                  style={{ color: 'grey' }}
                  size={15}
                />
              </TouchableOpacity>
            </View>
  
            {night ? (
              <View style={{ marginTop: 15 }}>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: 'grey',
                    marginBottom: 10,
                  }}
                />
                <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
                  {nightSlots.map((slot, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => returntime(slot.end, slot.start)}
                      >
                        <View
                          style={[
                            {
                              borderWidth: 1,
                              borderColor: 'grey',
                              borderRadius: 40,
                              marginHorizontal: 10,
                              marginTop: 10,
                            },
                            {
                              backgroundColor:
                                selectedEndSlot === slot.end &&
                                  selectedStartSlot == slot.start
                                  ? '#175CA4'
                                  : 'white',
                            },
                          ]}>
                          <Text
                            key={index}
                            style={[
                              {
                                color: 'black',
                                marginHorizontal: 14,
                                fontSize: 12,
                                marginVertical: 7,
                                fontFamily: 'Poppins-Regular',
                              },
                              {
                                color:
                                  selectedEndSlot === slot.end &&
                                    selectedStartSlot == slot.start
                                    ? 'white'
                                    : 'black',
                              },
                            ]}>
                            {slot.start} - {slot.end}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>
            ) : null}