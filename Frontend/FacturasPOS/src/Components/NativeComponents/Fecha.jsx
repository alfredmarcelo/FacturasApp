import { View, TouchableOpacity } from "react-native";
import Texts from "./Text";
import React, { useState } from "react";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function FechaSelector({ setShowFecha, setgetFecha }) {
  const [date, setDate] = useState(new Date()); // Fecha seleccionada

  // Función para manejar cambio de fecha
  const onChange = (event, selectedDate) => {
    setShowFecha(false);
    if (selectedDate) {
      setDate(selectedDate);
      console.log(selectedDate);
      setgetFecha(selectedDate.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }));
    }
  };

  return (
    <View>
      {setShowFecha && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}
