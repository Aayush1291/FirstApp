import {
    Icon,
    TouchableOpacity,
    View,
    Text,
    ScrollView,
    Alert,
    Image,
    Pressable,
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import {
    responsiveWidth,
    responsiveHeight,
    responsiveFontSize,
  } from 'react-native-responsive-dimensions';
  import moment, { duration } from 'moment';
  import AntDesign from 'react-native-vector-icons/AntDesign';
  import Calendar from './Calendar';
  import AsyncStorage from '@react-native-async-storage/async-storage';

  
  const generateTimeSlots = (startTime, endTime, duration) => {
    const slots = [];
    const format = 'h:mm A';
    const start = moment(startTime, 'h:mm A');
    const end = moment(endTime, 'h:mm A');
    const timeSlotDuration = moment.duration(duration, 'minutes');
  
    let slotStart = start.clone();
    while (slotStart.isBefore(end)) {
      const slotEnd = slotStart.clone().add(timeSlotDuration);
      if (slotEnd.isAfter(end)) {
        break;
      }
      const isBetweenNoonSlots = slotStart.isBefore(moment('1:00 PM', 'h:mm A')) &&
        slotEnd.isAfter(moment('12:00 PM', 'h:mm A'));
      if (!isBetweenNoonSlots) {
        slots.push({
          start: slotStart.format(format),
          end: slotEnd.format(format),
        });
      }
      slotStart = slotEnd;
    }
    return slots;
  };
  
  const Book_Appointment = () => {
    const [apiContent, setApiContent] = useState(null);
    let [timeSlotDuration, setTimeSlotDuration] = useState(60);
  
    const [morning, setMorning] = useState(false);
    const [day, setDay] = useState(false);
    const [night, setNight] = useState(false);
  
    const [roleData, setroleData] = useState('');
    const [roles, setroles] = useState(false);
  
    const [data, setData] = useState([]);
    const [serviceName, setServiceName] = useState(null);
    const [selectedStartSlot, setselectedStartSlot] = useState(null);
    const [selectedEndSlot, setselectedEndSlot] = useState(null);
    const [categoryData, setCategoryData] = useState([]);
    const [selectedDate, setDate] = useState('');
    const [selectDay, setselectDay] = useState('');
  
    const [morningSlots, setmorningSlots] = useState([]);
    const [daySlots, setdaySlots] = useState([]);
    const [nightSlots, setnightSlots] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
  
    let username = '';
    let email = '';
  
    const handleSubmission = async () => {
      username = await AsyncStorage.getItem('UserName');
      email = await AsyncStorage.getItem('Email');
      const currentDate = new Date();
      const currentTime = new Date();
  
      const date = currentDate.toLocaleDateString();
      const time = currentTime.toLocaleTimeString();
  
      if (
        !serviceName ||
        !timeSlotDuration ||
        !selectedEndSlot ||
        !date ||
        !selectedStartSlot ||
        !categoryData
      ) {
        Alert.alert('Error', 'Fill all fields');
      } else {
        if (username == '' || email == '') {
          Alert.alert('Error', 'Fields not found!');
        } else {
          try {
            const response = await fetch('https://retoolapi.dev/Xim6Z4/data', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username,
                timeSlotDuration: timeSlotDuration,
                serviceName: serviceName,
                endTime: selectedEndSlot,
                startTime: selectedStartSlot,
                category: categoryData,
                date: selectedDate,
              }),
            });
            if (response.ok) {
              Alert.alert('Appointment booked successfully');
            } else {
              console.error('Failed to book appointment');
            }
          } catch (error) {
            console.error('Error booking appointment:', error);
          }
        }
      }
    };
  
    useEffect(() => {
      fetchApiContent();
    }, []);
  
    const fetchApiContent = async () => {
      try {
        const response = await fetch('https://retoolapi.dev/D3HKGH/data');
        const data = await response.json();
        setApiContent(data);
  
        //roles
        const roleresponse = await fetch('https://myjsons.com/v/489d1424');
        const rolejsondata = await roleresponse.json();
        setroleData(rolejsondata.check);
        console.log(rolejsondata);
  
        //time
        const responseTimes = await fetch('https://retoolapi.dev/0roSS2/data');
        const jsonData = await responseTimes.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching API content:', error);
      }
    };
  
    if (!apiContent) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }
  
    const findStartAndEndTime = () => {
      const selection = apiContent.find((element) => element.selectedWeekday === selDay && element.username === names);
      console.log("firststart");
      console.log("selection", selection);
      if (selection) {
        const start = selection.fromTime;
        setStartTime(start)
        const end = selection.toTime;
        setEndTime(end)
        console.log("start", start);
        console.log("end", end);
        timeSlots = [];
        timeSlots = generateTimeSlots(start, end, timeSlotDuration);
        timedivision();
      }
      else {
        console.log("No item");
        setmorningSlots([]);
        setdaySlots([]);
        setnightSlots([]);
      }
    };
  
    let names;
    let durations = 60;
  
  
    function durationChange(d, val) {
      setCategoryData(val);
      durations = d;
      setTimeSlotDuration(durations);
      timeSlots = [];
      console.log("start time", startTime, "end time", endTime);
      timeSlots = generateTimeSlots(startTime, endTime, durations);
      console.log('ts', timeSlots);
      timedivision();
    }
  
  
    const dummyfunc = (name) => {
      names = name;
      setServiceName(name);
      console.log("new name selected");
      findStartAndEndTime();
    }
    console.log("SELECTED DATE", selectedDate);
    let selDay = selectDay;
  
    //for dividing the time into morning, day, night
    function timedivision() {
      let morning = [];
      let day = [];
      let night = [];
      timeSlots.forEach((slot) => {
        const slotStart = moment(slot.start, 'h:mm A');
        if (slotStart.isBefore(moment('12:00 PM', 'h:mm A'))) {
          morning.push(slot);
        } else if (slotStart.isSameOrAfter(moment('4:00 PM', 'h:mm A'))) {
          night.push(slot);
        } else {
          day.push(slot);
        }
      });
      setmorningSlots(morning);
      setdaySlots(day);
      setnightSlots(night);
    }
  
    function returntime(e, e1) {
      setselectedStartSlot(e1);
      setselectedEndSlot(e);
    }
    function newFunc(newD) {
      setselectDay(newD);
      selDay = newD;
      console.log("new day selected");
      findStartAndEndTime();
    }
  
    return (
      <ScrollView>
        <View style={{ marginHorizontal: responsiveWidth(4) }}>
          <View style={{ borderRadius: 15, marginTop: 20 }}>
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                fontFamily: 'Poppins-Regular',
              }}>
              {' '}
              Choose Date{' '}
            </Text>
            <Calendar onSelectDate={setDate} selected={selectedDate} onSelectDay={(d) => { newFunc(d) }} selectedDay={selectDay} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
            <Text style={{
              color: 'black',
              fontSize: 15,
              fontFamily: 'Poppins-Regular',
            }}> Select Role </Text>
  
            <TouchableOpacity onPress={() => {
              roles ? setroles(false) : setroles(true);
            }}>
              <AntDesign
                name={roles ? 'upcircle' : 'downcircle'}
                style={{ color: 'grey' }}
                size={15}
              />
            </TouchableOpacity>
          </View>
  
          {roles ? (
            <View>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: 'grey',
                  marginBottom: 10,
                }}
              />
  
              <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
                {roleData.map((element, index) => {
                  return (
                    <TouchableOpacity
                      key={element.id}
                      onPress={() => dummyfunc(element.username)}
                    >
                      {element.role === 1 && (
                        <View style={[{
                          borderWidth: 1,
                          borderColor: 'grey',
                          borderRadius: 40,
                          marginHorizontal: 10,
                          marginTop: 10,
  
                        }, {
                          backgroundColor:
                            serviceName === element.username
                              ? '#175CA4'
                              : 'white',
                        }]}>
                          <Text style={[{
                            color: 'black',
                            marginHorizontal: 14,
                            fontSize: 12,
                            marginVertical: 7,
                            fontFamily: 'Poppins-Regular',
                          },
                          {
                            color:
                              serviceName === element.username
                                ? 'white'
                                : 'black',
                          }]}>
                            {element.username}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )
            : null}
          <Text
            style={{
              color: 'black',
              fontSize: 15,
              fontFamily: 'Poppins-Regular',
              marginTop: 10,
            }}>
            {' '}
            Select Category{' '}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                borderColor: 'black',
                // borderRadius: 10,
                // justifyContent:'center'
                // alignItems:'center'
              }}>
              <TouchableOpacity
                onPress={() => durationChange(60, 'Introduction To Bynocs')}>
                <View
                  style={[
                    {
                      borderWidth: 1,
                      borderColor: 'black',
                      borderRadius: 10,
                      height: 70,
                      marginHorizontal: 10,
                      marginTop: 10,
                    },
                    {
                      backgroundColor:
                        // selectedCategory === element.category
                        categoryData === 'Introduction To Bynocs'
                          ? '#175CA4'
                          : 'white',
                    },
                  ]}>
                  <Text
                    style={[
                      {
                        color: 'black',
                        fontFamily: 'Poppins-Regular',
                        marginTop: 13,
                        marginHorizontal: 10,
                      },
                      {
                        color:
                          categoryData === 'Introduction To Bynocs'
                            ? 'white'
                            : 'black',
                      },
                    ]}>
                    {' '}
                    Introduction To Bynocs{' '}
                  </Text>
                  <Text
                    style={[
                      {
                        color: 'black',
                        fontFamily: 'Poppins-Regular',
                        marginHorizontal: 15,
                      },
                      {
                        color:
                          categoryData === 'Introduction To Bynocs'
                            ? 'white'
                            : 'black',
                      },
                    ]}>
                    60 mins
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => durationChange(45, 'Initial Assessment')}>
                <View
                  style={[
                    {
                      borderWidth: 1,
                      borderColor: 'black',
                      borderRadius: 10,
                      height: 70,
                      marginHorizontal: 10,
                      marginTop: 10,
                    },
                    {
                      backgroundColor:
                        // selectedCategory === element.category
                        categoryData === 'Initial Assessment'
                          ? '#175CA4'
                          : 'white',
                    },
                  ]}>
                  <Text
                    style={[
                      {
                        color: 'black',
                        fontFamily: 'Poppins-Regular',
                        marginTop: 13,
                        marginHorizontal: 10,
                      },
                      {
                        color:
                          categoryData === 'Initial Assessment'
                            ? 'white'
                            : 'black',
                      },
                    ]}>
                    {' '}
                    Initial Assessment{' '}
                  </Text>
                  <Text
                    style={[
                      {
                        color: 'black',
                        fontFamily: 'Poppins-Regular',
                        marginHorizontal: 15,
                      },
                      {
                        color:
                          categoryData === 'Initial Assessment'
                            ? 'white'
                            : 'black',
                      },
                    ]}>
                    45 mins
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => durationChange(45, 'Follow Up Assessment')}>
                <View
                  style={[
                    {
                      borderWidth: 1,
                      borderColor: 'black',
                      borderRadius: 10,
                      height: 70,
                      marginHorizontal: 10,
                      marginTop: 10,
                    },
                    {
                      backgroundColor:
                        // selectedCategory === element.category
                        categoryData === 'Follow Up Assessment'
                          ? '#175CA4'
                          : 'white',
                    },
                  ]}>
                  <Text
                    style={[
                      {
                        color: 'black',
                        fontFamily: 'Poppins-Regular',
                        marginTop: 13,
                        marginHorizontal: 10,
                      },
                      {
                        color:
                          categoryData === 'Follow Up Assessment'
                            ? 'white'
                            : 'black',
                      },
                    ]}>
                    {' '}
                    Follow Up Assessment{' '}
                  </Text>
                  <Text
                    style={[
                      {
                        color: 'black',
                        fontFamily: 'Poppins-Regular',
                        marginHorizontal: 15,
                      },
                      {
                        color:
                          categoryData === 'Follow Up Assessment'
                            ? 'white'
                            : 'black',
                      },
                    ]}>
                    45 mins
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => durationChange(15, 'Technical Support')}>
                <View
                  style={[
                    {
                      borderWidth: 1,
                      borderColor: 'black',
                      borderRadius: 10,
                      height: 70,
                      marginHorizontal: 10,
                      marginTop: 10,
                    },
                    {
                      backgroundColor:
                        // selectedCategory === element.category
                        categoryData === 'Technical Support'
                          ? '#175CA4'
                          : 'white',
                    },
                  ]}>
                  <Text
                    style={[
                      {
                        color: 'black',
                        fontFamily: 'Poppins-Regular',
                        marginTop: 13,
                        marginHorizontal: 10,
                      },
                      {
                        color:
                          categoryData === 'Technical Support'
                            ? 'white'
                            : 'black',
                      },
                    ]}>
                    {' '}
                    Technical Support{' '}
                  </Text>
                  <Text
                    style={[
                      {
                        color: 'black',
                        fontFamily: 'Poppins-Regular',
                        marginHorizontal: 15,
                      },
                      {
                        color:
                          categoryData === 'Technical Support'
                            ? 'white'
                            : 'black',
                      },
                    ]}>
                    15 mins
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
  
          <View style={{ marginTop: 30 }}>
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                fontFamily: 'Poppins-Regular',
              }}>
              {' '}
              Choose Time{' '}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'space-between',
              }}>
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={require('../assets/halfsun.png')}
                  style={{ width: 30, height: 18, marginTop: 5 }}
                />
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
                <Image
                  source={require('../assets/sun.png')}
                  style={{ width: 30, height: 30 }}
                />
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
                <Image
                  source={require('../assets/moon.png')}
                  style={{ width: 24, height: 28, marginLeft: 5 }}
                />
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
          </View>
  
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              marginTop: 20,
            }}>
            <TouchableOpacity
              style={{}}
              onPress={handleSubmission}
            >
              <View
                style={{
                  color: 'white',
                  width: '90%',
                  backgroundColor: '#175CA4',
                  height: 40,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '600',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Set Date & Time
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };
  export default Book_Appointment;