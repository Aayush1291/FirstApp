import {
    Icon,
    TouchableOpacity,
    View,
    Text,
    ScrollView,
    Alert,
    Image,
    Pressable,
    ActivityIndicator
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
  
  //timeslot
  // const generateTimeSlots = (startTime, endTime, duration) => {
  //   const slots = [];
  //   const format = 'h:mm A';
  //   const start = moment(startTime, 'h:mm A');
  //   const end = moment(endTime, 'h:mm A');
  //   const timeSlotDuration = moment.duration(duration, 'minutes');
  //   let slotStart = start.clone();
  //   while (slotStart.isBefore(end)) {
  //     const slotEnd = slotStart.clone().add(timeSlotDuration);
  //     if (slotEnd.isAfter(end)) {
  //       break;
  //     }
  //     const isBetweenNoonSlots = slotStart.isBefore(moment('1:00 PM', 'h:mm A')) &&
  //       slotEnd.isAfter(moment('12:00 PM', 'h:mm A'));
  //     if (!isBetweenNoonSlots) {
  //       slots.push({
  //         start: slotStart.format(format),
  //         end: slotEnd.format(format),
  //       });
  //     }
  //     slotStart = slotEnd;
  //   }
  //   return slots;
  // };
  
  const Book_Appointment = () => {
    const [apiContent, setApiContent] = useState(null);
  
    const [morning, setMorning] = useState(false);
    const [day, setDay] = useState(false);
    const [night, setNight] = useState(false);
  
    const [roleData, setRoleData] = useState('');
    const [rolesDropdown, setRolesDropdown] = useState(false);
  
    const [timeData, setTimeData] = useState([]);
    const [serviceName, setServiceName] = useState(null);
    const [selectedStartSlot, setselectedStartSlot] = useState(null);
    const [selectedEndSlot, setselectedEndSlot] = useState(null);
    const [categoryData, setCategoryData] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [serviceSelectedDay, setServiceSelectedDay] = useState('');
    const [selectedSlotDuration, setSelectedSlotDuartion]= useState('');
  
    const [morningSlots, setmorningSlots] = useState([]);
    const [daySlots, setdaySlots] = useState([]);
    const [nightSlots, setnightSlots] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
  
    let username = '';
    let email = '';
  
    // const handleSubmission = async () => {
    //   username = await AsyncStorage.getItem('UserName');
    //   email = await AsyncStorage.getItem('Email');
    //   const currentDate = new Date();
    //   const currentTime = new Date();
  
    //   const date = currentDate.toLocaleDateString();
    //   const time = currentTime.toLocaleTimeString();
  
    //   if (
    //     !serviceName ||
    //     !timeSlotDuration ||
    //     !selectedEndSlot ||
    //     !date ||
    //     !selectedStartSlot ||
    //     !categoryData
    //   ) {
    //     Alert.alert('Error', 'Fill all fields');
    //   } else {
    //     if (username == '' || email == '') {
    //       Alert.alert('Error', 'Fields not found!');
    //     } else {
    //       try {
    //         const response = await fetch('https://retoolapi.dev/Xim6Z4/data', {
    //           method: 'POST',
    //           headers: {
    //             'Content-Type': 'application/json',
    //           },
    //           body: JSON.stringify({
    //             username,
    //             timeSlotDuration: timeSlotDuration,
    //             serviceName: serviceName,
    //             endTime: selectedEndSlot,
    //             startTime: selectedStartSlot,
    //             category: categoryData,
    //             date: selectedDate,
    //           }),
    //         });
    //         if (response.ok) {
    //           Alert.alert('Appointment booked successfully');
    //         } else {
    //           console.error('Failed to book appointment');
    //         }
    //       } catch (error) {
    //         console.error('Error booking appointment:', error);
    //       }
    //     }
    //   }
    // };
  
    useEffect(() => {
      fetchApiContent();
    }, []);
  
    const fetchApiContent = async () => {
      try {
        const response = await fetch('https://retoolapi.dev/D3HKGH/data'); //VISITING TIME
        const data = await response.json();
        setApiContent(data);
        console.log("VISITING TIME= ",apiContent)
        data.forEach(item => {
          console.log("selected weekday by service team= ",item.selectedWeekday);
        });
  
        const roleresponse = await fetch('https://myjsons.com/v/489d1424');
        const rolejsondata = await roleresponse.json();
        setRoleData(rolejsondata.check);
        console.log("ROLES DATA= ", roleData);
  
        const responseTimes = await fetch('https://retoolapi.dev/0roSS2/data'); //TIME OFF
        const jsonData = await responseTimes.json();
        setTimeData(jsonData);
        console.log("TIME OFF= ", timeData)
      } catch (error) {
        console.error('Error fetching API content:', error);
      }
    };
  
    if (!apiContent) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#175CA4" />
        </View>
      );
    }
  
    // const findStartAndEndTime = () => {
    //   const selection = apiContent.find((element) => element.selectedWeekday === selDay && element.username === names);
    //   console.log("firststart");
    //   console.log("selection", selection);
    //   if (selection) {
    //     const start = selection.fromTime;
    //     setStartTime(start)
    //     const end = selection.toTime;
    //     setEndTime(end)
    //     console.log("start", start);
    //     console.log("end", end);
    //     timeSlots = [];
    //     timeSlots = generateTimeSlots(start, end, timeSlotDuration);
    //     timedivision();
    //   }
    //   else {
    //     console.log("No item");
    //     setmorningSlots([]);
    //     setdaySlots([]);
    //     setnightSlots([]);
    //   }
    // };
  
    let names;
    let durations = 60;
  
  
    function durationChange(d, val) {
      setCategoryData(val);
      setSelectedSlotDuartion(d)
      console.log("duration=", selectedSlotDuration)
      console.log("Value= ", categoryData);
      // timeSlots = [];
      // console.log("start time", startTime, "end time", endTime);
      // timeSlots = generateTimeSlots(startTime, endTime, durations);
      // console.log('ts', timeSlots);
      // timedivision();
    }
  
  
    const dummyfunc = (name) => {
      names = name;
      setServiceName(name);
      console.log("Role person selected", serviceName);
      findStartAndEndTime();
    }
    // console.log("SELECTED DATE", selectedDate);
    // let selDay = selectDay;
  
    // //for dividing the time into morning, day, night
    // function timedivision() {
    //   let morning = [];
    //   let day = [];
    //   let night = [];
    //   timeSlots.forEach((slot) => {
    //     const slotStart = moment(slot.start, 'h:mm A');
    //     if (slotStart.isBefore(moment('12:00 PM', 'h:mm A'))) {
    //       morning.push(slot);
    //     } else if (slotStart.isSameOrAfter(moment('4:00 PM', 'h:mm A'))) {
    //       night.push(slot);
    //     } else {
    //       day.push(slot);
    //     }
    //   });
    //   setmorningSlots(morning);
    //   setdaySlots(day);
    //   setnightSlots(night);
    // }
  
    // function returntime(e, e1) {
    //   setselectedStartSlot(e1);
    //   setselectedEndSlot(e);
    // }
  
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
              Choose Date
            </Text>
            <Calendar onSelectDate={setSelectedDate} selected={selectedDate} onSelectDay={setSelectedDay} selectedDay={selectedDay} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
            <Text style={{
              color: 'black',
              fontSize: 15,
              fontFamily: 'Poppins-Regular',
            }}> Select Role </Text>
            <TouchableOpacity onPress={() => {
              rolesDropdown ? setRolesDropdown(false) : setRolesDropdown(true);
            }}>
              <AntDesign
                name={rolesDropdown ? 'upcircle' : 'downcircle'}
                style={{ color: 'grey' }}
                size={15}
              />
            </TouchableOpacity>
          </View>
          {rolesDropdown ? (
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
                {roleData.map((element) => {
                  return (
                    <TouchableOpacity
                      key={element.id}
                      onPress={() => {
                        console.log(element.username);
                        setServiceName(element.username);
                        // findStartAndEndTime();
                      }}
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
            Select Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                borderColor: 'black',
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
        </View>
      </ScrollView>
    );
  };
  export default Book_Appointment;