import { Text } from "react-native"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";


export default function Texts(props) {
    return (
        <Text allowFontScaling={false} style={{ fontSize: RFValue(12) }} {...props}>
            {props.children}
        </Text>
    )
}