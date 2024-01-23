import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import moment from 'moment'
import { responsiveWidth, responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions'

const Date = ({ date, onSelectDate, selected,  onSelectDay, selectedDay }) => {
  
  /**
   * use moment to compare the date to today
   * if today, show 'Today'
   * if not today, show day of the week e.g 'Mon', 'Tue', 'Wed'
   */
  const day = moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ?  moment(date).format('ddd') : moment(date).format('ddd')
  const newday = moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ?  moment(date).format('dddd') : moment(date).format('dddd')
  
  // get the day number e.g 1, 2, 3, 4, 5, 6, 7
  const dayNumber = moment(date).format('D')

  // get the full date e.g 2021-01-01 - we'll use this to compare the date to the selected date
  const fullDate = moment(date).format('YYYY-MM-DD')
  const selection=(date, days)=>{
    onSelectDate(date);
    onSelectDay(days)
  }
  return (
    <TouchableOpacity 
      onPress={() => selection(fullDate, newday)}
      style={[styles.card, selected === fullDate && { backgroundColor: "#175CA4" },{borderRadius:50}]}
    >
      <Text
        style={[styles.big,{  fontFamily:'Poppins-Regular', }, selected === fullDate && { color: "#fff" },day=='Sun'&&{color:'red'}]}
      >
        {day}
      </Text>
      <View style={{ height: 4}} />
      <Text
        style={[
          styles.medium,
          selected === fullDate && { color: "#fff", fontSize: responsiveFontSize(2.5)},
          day=='Sun'&&{color:'red'}
        ]}
      > 
        {dayNumber}
      </Text>
    </TouchableOpacity>
  )
}

export default Date

const styles = StyleSheet.create({
  card: {
    borderColor: '#ddd',
    padding: 10,
    borderWidth:2,
    alignItems: 'center',
    height: responsiveHeight(10),
    width: responsiveWidth(15),
    marginHorizontal: 5,
  },
  big: {
    fontFamily:'Poppins-Regular',
    fontSize: responsiveFontSize(1.7),
    color:'black',
  },
  medium: {
    fontSize: responsiveFontSize(2.5),
    color:'black',
    fontFamily:'Poppins-Regular',
  },
})