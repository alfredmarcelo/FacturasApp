if(NOT TARGET react-native-vision-camera::VisionCamera)
add_library(react-native-vision-camera::VisionCamera SHARED IMPORTED)
set_target_properties(react-native-vision-camera::VisionCamera PROPERTIES
    IMPORTED_LOCATION "/home/alfred/FacturasApp/Frontend/FacturasPOS/node_modules/react-native-vision-camera/android/build/intermediates/cxx/Debug/33o82r2c/obj/x86_64/libVisionCamera.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/alfred/FacturasApp/Frontend/FacturasPOS/node_modules/react-native-vision-camera/android/build/headers/visioncamera"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

