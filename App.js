import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import moment, { duration } from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Calendar from './Calendar';

const Book_Appointment = () => {
  const [apiContent, setApiContent] = useState(null);
  const [bookedAppoinmentData, setBookedAppointmentData] = useState(null)
  const [roleData, setRoleData] = useState('');
  const [rolesDropdown, setRolesDropdown] = useState(false);
  const [morningSlots, setMorningSlots] = useState([]);
  const [afternoonSlots, setAfternoonSlots] = useState([]);
  const [eveningSlots, setEveningSlots] = useState([]);
  const [morningDropdown, setMorningDropdown] = useState(false);
  const [afternoonDropdown, setAfternoonDropdown] = useState(false);
  const [eveningDropdown, setEveningDropdown] = useState(false);
  const [selectedMorningSlot, setSelectedMorningSlot] = useState(null);
  const [selectedAfternoonSlot, setSelectedAfternoonSlot] = useState(null);
  const [selectedEveningSlot, setSelectedEveningSlot] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [timeData, setTimeData] = useState([]);
  const [serviceName, setServiceName] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedSlotDuration, setSelectedSlotDuartion] = useState('');

  const createTimeslots = () => {
    console.log('Selected Day:', selectedDay);
    console.log('Service Name:', serviceName);
    console.log('Category Data:', categoryData);
    console.log('Selected Slot Duration:', selectedSlotDuration);

    // Step 1: Filter relevant data
    const selectedServiceData = apiContent.filter(item =>
      item.selectedWeekday === selectedDay && item.username === serviceName
    );

    console.log('Selected Service Data:', selectedServiceData);

    const bookedAppointments = bookedAppoinmentData; // Replace with your actual bookedAppointment data

    // Check if there is a booked appointment matching the selectedDate and serviceName
    const matchingAppointment = bookedAppointments.filter(appointment =>
      appointment.selectedDay === selectedDay &&
      appointment.serviceName === serviceName &&
      appointment.selectedDate === selectedDate
    );

    // Log each matching appointment
    if (matchingAppointment.length > 0) {
      console.log('Matching Appointments:');
      matchingAppointment.forEach(appointment => {
        console.log('- Date:', appointment.selectedDate);
        console.log('- Day:', appointment.selectedDay);
        console.log('- Service Name:', appointment.serviceName);
        console.log('- Start Time:', appointment.selectedSlotStart);
        console.log('- End Time:', appointment.selectedSlotEnd);
        console.log('---------------------------');
      });
    }

    // Step 2: Check time off data
    const timeOffData = timeData.filter(item =>
      item.weekday === selectedDay && item.username === serviceName
    );

    console.log('Time Off Data:', timeOffData);

    // Check if the selected slot duration is not in time off data
    if (!timeOffData.some(item => String(item.start).toUpperCase() === String(selectedSlotDuration).toUpperCase())) {
      // Clear existing slots before generating new ones
      setMorningSlots([]);
      setAfternoonSlots([]);
      setEveningSlots([]);
      console.log("inside!!!!")
      // Step 3: Create time slots
      selectedServiceData.forEach(item => {
        const { toTime, fromTime } = item;

        // Use generateTimeSlots function
        const { morningSlots, afternoonSlots, eveningSlots } = generateTimeSlots(fromTime, toTime, selectedSlotDuration, timeOffData, matchingAppointment);

        // Update state variables
        setMorningSlots(prevSlots => [...prevSlots, ...morningSlots]);
        setAfternoonSlots(prevSlots => [...prevSlots, ...afternoonSlots]);
        setEveningSlots(prevSlots => [...prevSlots, ...eveningSlots]);

        // Use the generated time slots state or dispatch an action
        console.log('Morning Slots:', morningSlots);
        console.log('Afternoon Slots:', afternoonSlots);
        console.log('Evening Slots:', eveningSlots);
      });
    } else {
      // Handle case where selected slot duration is in time off data
      console.log('Selected slot duration is not available for the selected service on the selected day.');
    }
  };


  const generateTimeSlots = (startTime, endTime, duration, timeOffData, bookedAppointments) => {
    const morningSlots = [];
    const afternoonSlots = [];
    const eveningSlots = [];
    const format = 'h:mm A';

    const start = moment(startTime, 'h:mm A');
    const end = moment(endTime, 'h:mm A');
    const timeSlotDuration = moment.duration(duration, 'minutes');

    let slotStart = start.clone();
    while (slotStart.isBefore(end)) {
      const slotEnd = slotStart.clone().add(timeSlotDuration);

      // Check if the slot is during time off
      const isDuringTimeOff = timeOffData.some(item =>
        moment(slotStart).isSameOrAfter(moment(item.start, 'h:mm A')) &&
        moment(slotEnd).isSameOrBefore(moment(item.end, 'h:mm A'))
      );

      // Check if the slot overlaps with any existing booked appointments
      const isBooked = bookedAppointments.some(appointment =>
        moment(slotStart).isBefore(moment(appointment.selectedSlotEnd, 'h:mm A')) &&
        moment(slotEnd).isAfter(moment(appointment.selectedSlotStart, 'h:mm A'))
      );

      if (!isDuringTimeOff && !isBooked) {
        const slot = {
          start: slotStart.format(format),
          end: slotEnd.format(format),
        };

        // Categorize slots based on time ranges
        if (slotStart.isBefore(moment('12:00 PM', 'h:mm A'))) {
          morningSlots.push(slot);
        } else if (slotStart.isBefore(moment('4:00 PM', 'h:mm A'))) {
          afternoonSlots.push(slot);
        } else {
          eveningSlots.push(slot);
        }
      }

      slotStart = slotEnd;
    }

    return { morningSlots, afternoonSlots, eveningSlots };
  };



  const toggleMorningDropdown = () => {
    setMorningDropdown(!morningDropdown);
    setSelectedAfternoonSlot(null);
    setSelectedEveningSlot(null);
  };

  const toggleAfternoonDropdown = () => {
    setAfternoonDropdown(!afternoonDropdown);
    setSelectedMorningSlot(null);
    setSelectedEveningSlot(null);
  };

  const toggleEveningDropdown = () => {
    setEveningDropdown(!eveningDropdown);
    setSelectedMorningSlot(null);
    setSelectedAfternoonSlot(null);
  };

  const handleMorningSlotClick = (index) => {
    const selectedSlot = morningSlots[index]; // Access the selected slot using the index
    setSelectedTimeSlot(selectedSlot)
    setSelectedMorningSlot(index);
    setSelectedAfternoonSlot(null);
    setSelectedEveningSlot(null);
    // Add your logic for handling the click event
  };


  const handleAfternoonSlotClick = (index) => {
    const selectedSlot = afternoonSlots[index]; // Access the selected slot using the index
    setSelectedTimeSlot(selectedSlot);
    setSelectedMorningSlot(null);
    setSelectedAfternoonSlot(index);
    setSelectedEveningSlot(null);
    // Add your logic for handling the click event
  };

  const handleEveningSlotClick = (index) => {
    const selectedSlot = eveningSlots[index]; // Access the selected slot using the index
    setSelectedTimeSlot(selectedSlot)
    setSelectedMorningSlot(null);
    setSelectedAfternoonSlot(null);
    setSelectedEveningSlot(index);
    // Add your logic for handling the click event
  };

  const handlePress = async () => {
    if (!selectedDate || !selectedDay || !serviceName || !categoryData || !selectedSlotDuration || !selectedTimeSlot) {
      console.log('Nothing selected. Please make sure all parameters are selected.');
    } else {
      console.log('Selected Date:', selectedDate);
      console.log('Selected Day:', selectedDay);
      console.log('Service Name:', serviceName);
      console.log('Category Data:', categoryData);
      console.log('Selected Slot Duration:', selectedSlotDuration);
      console.log('Selected Time Slot Start:', selectedTimeSlot.start);
      console.log('Selected Time Slot End:', selectedTimeSlot.end);
      const selectedSlotStart = selectedTimeSlot.start;
      const selectedSlotEnd = selectedTimeSlot.end;

      // Assuming you have an API endpoint to post the data
      const apiEndpoint = 'https://retoolapi.dev/Vq5bCR/newdummy';
      // const apiEndpoint = 'https://retoolapi.dev/Cy0wpV/appdummy';


      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add any additional headers if needed
          },
          body: JSON.stringify({
            selectedDate,
            selectedDay,
            serviceName,
            categoryData,
            selectedSlotDuration,
            selectedSlotStart,
            selectedSlotEnd
          }),
        });

        // Check if the API call was successful
        if (response.ok) {
          console.log('Data successfully submitted to the API.');
          Alert.alert("Your response has been recorded!")

          // Reset the state and re-fetch data
          setMorningSlots([]);
          setAfternoonSlots([]);
          setEveningSlots([]);
          setSelectedDate('');
          setSelectedDay('');
          setServiceName(null);
          setCategoryData([]);
          setSelectedSlotDuartion('');
          setSelectedTimeSlot(null);
          setApiContent(null)
          setAfternoonDropdown(null)
          setMorningDropdown(null)
          setEveningDropdown(null)
          // Re-fetch data
          fetchApiContent();
        } else {
          console.error('Failed to submit data to the API.');
        }
      } catch (error) {
        console.error('Error making API call:', error);
      }
    }
  };




  useEffect(() => {
    fetchApiContent();
  }, []);

  useEffect(() => {
    if (selectedDay && serviceName && categoryData && selectedSlotDuration) {
      createTimeslots();
    }
  }, [selectedDay, serviceName, categoryData, selectedSlotDuration]);

  const fetchApiContent = async () => {
    try {
      const response = await fetch('https://retoolapi.dev/D3HKGH/data'); //VISITING TIME
      const data = await response.json();
      setApiContent(data);
      console.log("VISITING TIME= ", apiContent)
      data.forEach(item => {
        console.log("selected weekday by service team= ", item.selectedWeekday);
      });

      const bookedResponse = await fetch('https://retoolapi.dev/Vq5bCR/newdummy'); //BOOKED APPOINTMENT
      // const bookedResponse = await fetch ('https://retoolapi.dev/Cy0wpV/appdummy');
      const bookedData = await bookedResponse.json();
      setBookedAppointmentData(bookedData);
      console.log("booked", bookedData)

      const roleresponse = await fetch('https://myjsons.com/v/489d1424');
      const rolejsondata = await roleresponse.json();
      setRoleData(rolejsondata.check);
      console.log("ROLES DATA= ", roleData);

      const responseTimes = await fetch('https://myjsons.com/v/c8062476'); //TIME OFF
      // const responseTimes = await fetch('https://retoolapi.dev/0roSS2/data'); //TIME OFF
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

  function durationChange(d, val) {
    setCategoryData(val);
    setSelectedSlotDuartion(d)
    console.log("duration=", selectedSlotDuration)
    console.log("Value= ", categoryData);
  }

  return (
    <ScrollView>
      <View style={{ marginHorizontal: responsiveWidth(4), flex: 1 }}>
        <View style={{ borderRadius: 15, marginTop: 20, flex: 1 }}>
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
          }}>Select Role</Text>
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

                  Introduction To Bynocs
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

                  Initial Assessment
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

                  Follow Up Assessment
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

                  Technical Support
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
              Morning
            </Text>
          </View>
          <TouchableOpacity onPress={toggleMorningDropdown}>
            <AntDesign
              name={morningDropdown ? 'upcircle' : 'downcircle'}
              style={{ color: 'grey' }}
              size={15}
            />
          </TouchableOpacity>
        </View>

        {morningDropdown ? (
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
              {morningSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleMorningSlotClick(index)}
                >
                  <View
                    style={[
                      {
                        borderWidth: 1,
                        borderColor: 'grey',
                        borderRadius: 40,
                        marginHorizontal: 10,
                        marginTop: 10,
                        backgroundColor:
                          selectedMorningSlot === index ? '#175CA4' : 'white',
                      },
                    ]}>
                    <Text
                      key={index}
                      style={[
                        {
                          color: selectedMorningSlot === index ? 'white' : 'black',
                          marginHorizontal: 14,
                          fontSize: 12,
                          marginVertical: 7,
                          fontFamily: 'Poppins-Regular',
                        },
                      ]}>
                      {slot.start} - {slot.end}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
            {/* <Image
              source={require('../assets/sun.png')}
              style={{ width: 30, height: 30 }}
            /> */}
            <Text style={{ color: 'black', fontSize: 18, fontFamily: 'Poppins-Regular' }}>
              Day
            </Text>
          </View>
          <TouchableOpacity onPress={toggleAfternoonDropdown}>
            <AntDesign
              name={afternoonDropdown ? 'upcircle' : 'downcircle'}
              style={{ color: 'grey' }}
              size={15}
            />
          </TouchableOpacity>
        </View>

        {afternoonDropdown ? (
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
              {afternoonSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleAfternoonSlotClick(index)}
                >
                  <View
                    style={[
                      {
                        borderWidth: 1,
                        borderColor: 'grey',
                        borderRadius: 40,
                        marginHorizontal: 10,
                        marginTop: 10,
                        backgroundColor:
                          selectedAfternoonSlot === index ? '#175CA4' : 'white',
                      },
                    ]}>
                    <Text
                      key={index}
                      style={[
                        {
                          color: selectedAfternoonSlot === index ? 'white' : 'black',
                          marginHorizontal: 14,
                          fontSize: 12,
                          marginVertical: 7,
                          fontFamily: 'Poppins-Regular',
                        },
                      ]}>
                      {slot.start} - {slot.end}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
            {/* <Image
              source={require('../assets/moon.png')}
              style={{ width: 24, height: 28, marginLeft: 5 }}
            /> */}
            <Text style={{ color: 'black', fontSize: 18, fontFamily: 'Poppins-Regular' }}>
              Night
            </Text>
          </View>
          <TouchableOpacity onPress={toggleEveningDropdown}>
            <AntDesign
              name={eveningDropdown ? 'upcircle' : 'downcircle'}
              style={{ color: 'grey' }}
              size={15}
            />
          </TouchableOpacity>
        </View>

        {eveningDropdown ? (
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
              {eveningSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleEveningSlotClick(index)}
                >
                  <View
                    style={[
                      {
                        borderWidth: 1,
                        borderColor: 'grey',
                        borderRadius: 40,
                        marginHorizontal: 10,
                        marginTop: 10,
                        backgroundColor:
                          selectedEveningSlot === index ? '#175CA4' : 'white',
                      },
                    ]}>
                    <Text
                      key={index}
                      style={[
                        {
                          color: selectedEveningSlot === index ? 'white' : 'black',
                          marginHorizontal: 14,
                          fontSize: 12,
                          marginVertical: 7,
                          fontFamily: 'Poppins-Regular',
                        },
                      ]}>
                      {slot.start} - {slot.end}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#175CA4',
                paddingVertical: 15,  // Adjusted padding
                paddingHorizontal: 30, // Adjusted padding
                borderRadius: 8,      // Adjusted border radius
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 20,  // Adjusted margin
              }}
              onPress={handlePress}
            >
              <Text style={{
                color: 'white',
                fontSize: 18,  // Adjusted font size
                fontWeight: 'bold',
              }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
export default Book_Appointment;