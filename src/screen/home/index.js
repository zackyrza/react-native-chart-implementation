import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, StyleSheet, View, Alert} from 'react-native';
import {Text, FAB, List, Button} from 'react-native-paper';
import {
    Colors,
} from 'react-native/Libraries/NewAppScreen';
import moment from 'moment';
import {Svg, Rect, Text as TextSVG} from 'react-native-svg';

import {
    LineChart,
} from 'react-native-chart-kit';
import NumberFormat from 'react-number-format';

export const uri = 'https://develop3.kickavenue.com/products/sale-history?ids=';

const HomeScreen = ({navigation}) => {

    const [graphData, setGraphData] = useState({
        labels: [],
        data: [],
    });
    const [showData, setShowData] = useState({
        labels: [],
        data: [],
    });
    const [tooltipPos, setTooltipPos] = useState({x: 0, y: 0, visible: false, value: '0', label: ''});

    const [selectedDuration, setSelectedDuration] = useState('all');

    useEffect(() => {
        getData(6);
    }, []);

    const getData = async (id) => {
        let headers = new Headers();
        return fetch(uri + id, headers)
            .then(response => {
                return response.json();
            })
            .then(async res => {
                let fetchedData = res.data[6].sort((a, b) => {
                    return new Date(a.customer_paid.split(' ')[0]) - new Date(b.customer_paid.split(' ')[0]);
                });
                let lengthFetchedData = fetchedData.length;
                let labels = [];
                let data = [];
                let finalState = {};

                let minimumDateMoment = moment(fetchedData[0].customer_paid.split(' ')[0]);
                let maximumDateMoment = moment(fetchedData[lengthFetchedData - 1].customer_paid.split(' ')[0]);
                let currentDate = moment(minimumDateMoment);

                let daysDiff = maximumDateMoment.diff(minimumDateMoment, 'days');

                for (let i = 0, value = 0, size = daysDiff; i <= size; i++) {
                    data[i] = value;
                }
                for (let i = 0, size = daysDiff; i <= size; i++) {
                    labels[i] = moment(currentDate).format('YYYY-MM-DD');
                    currentDate = moment(currentDate).add(1, 'days');
                }
                ;

                await fetchedData.map((t, d, e) => {
                    // console.log(e[d+1]);
                    const date = t.customer_paid.split(' ')[0];
                    const dateMoment = moment(t.customer_paid.split(' ')[0]);
                    const diffToMinimumDate = dateMoment.diff(minimumDateMoment, 'days');

                    // console.log({diffToMinimumDate});

                    const price = parseInt(t.price);

                    if (!data[diffToMinimumDate].price || data[diffToMinimumDate].price < price) {
                        data[diffToMinimumDate] = price;
                    }
                });

                finalState = {
                    labels,
                    data,
                };
                setGraphData(finalState);
                setShowData(finalState);

                // console.log(finalState);

                return finalState;
            });
    };

    const formatRupiah = (angka, prefix, suffix) => {
        let number_string = angka.toString(),
            split = number_string.split(','),
            sisa = split[0].length % 3,
            rupiah = split[0].substr(0, sisa),
            ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        // tambahkan titik jika yang di input sudah menjadi angka ribuan
        if (ribuan) {
            let separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }

        rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
        if(suffix) rupiah += suffix;
        return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
    };

    return (
        <>
            <View style={styles.container}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: Dimensions.get('window').width - 20,
                }}>
                    <Button color={selectedDuration === '1m' ? '#fb8c00' : '#bbb'} mode="contained" onPress={() => {
                        setSelectedDuration('1m');
                        setTooltipPos({x: 0, y: 0, visible: false, value: '0', label: ''});
                        setShowData({
                            labels: graphData.labels.slice(graphData.labels.length - 31),
                            data: graphData.data.slice(graphData.data.length - 31),
                        });
                    }}>
                        1 Month
                    </Button>
                    <Button color={selectedDuration === '3m' ? '#fb8c00' : '#bbb'} mode="contained" onPress={() => {
                        setSelectedDuration('3m');
                        setTooltipPos({x: 0, y: 0, visible: false, value: '0', label: ''});
                        setShowData({
                            labels: graphData.labels.slice(graphData.labels.length - 91),
                            data: graphData.data.slice(graphData.data.length - 91),
                        });
                    }}>
                        3 Month
                    </Button>
                    <Button color={selectedDuration === '1y' ? '#fb8c00' : '#bbb'} mode="contained" onPress={() => {
                        setSelectedDuration('1y');
                        setTooltipPos({x: 0, y: 0, visible: false, value: '0', label: ''});
                        setShowData({
                            labels: graphData.labels.slice(graphData.labels.length - 366),
                            data: graphData.data.slice(graphData.data.length - 366),
                        });
                    }}>
                        1 Year
                    </Button>
                    <Button color={selectedDuration === 'all' ? '#fb8c00' : '#bbb'} mode="contained" onPress={() => {
                        setSelectedDuration('all');
                        setTooltipPos({x: 0, y: 0, visible: false, value: '0', label: ''});
                        setShowData({
                            labels: graphData.labels,
                            data: graphData.data,
                        });
                    }}>
                        All
                    </Button>
                </View>
                {(showData.labels.length > 0 && showData.data.length > 0) && (
                    <LineChart
                        onDataPointClick={(data) => {
                            let isSamePoint = (tooltipPos.x === data.x && tooltipPos.y === data.y);

                            isSamePoint ? setTooltipPos((previousState) => {
                                    return {
                                        ...previousState,
                                        value: formatRupiah(data.value, 'Rp. '),
                                        label: showData.labels[data.index],
                                        visible: !previousState.visible,
                                    }
                                })
                                :
                                setTooltipPos({ x: data.x, label: showData.labels[data.index], value: formatRupiah(data.value, 'Rp. '), y: data.y, visible: true });

                        }}
                        decorator={() => {
                            return tooltipPos.visible ? <View>
                                <Svg>
                                    <Rect x={tooltipPos.x - 70}
                                          y={tooltipPos.y + 10}
                                          width="150"
                                          height="50"
                                          fill="black" />
                                    <TextSVG
                                        x={tooltipPos.x + 5}
                                        y={tooltipPos.y + 30}
                                        fill="white"
                                        fontSize="16"
                                        fontWeight="bold"
                                        textAnchor="middle">
                                        {tooltipPos.label}
                                    </TextSVG>
                                    <TextSVG
                                        x={tooltipPos.x + 5}
                                        y={tooltipPos.y + 50}
                                        fill="white"
                                        fontSize="16"
                                        fontWeight="bold"
                                        textAnchor="middle">
                                        {tooltipPos.value}
                                    </TextSVG>
                                </Svg>
                            </View> : null
                        }}
                        data={{
                            labels: showData.labels,
                            datasets: [
                                {
                                    data: showData.data,
                                },
                            ],
                        }}
                        width={Dimensions.get('window').width - 20} // from react-native
                        height={Dimensions.get('window').height * 0.4}
                        formatYLabel={y => formatRupiah(y/1000000, 'Rp. ', 'jt')}
                        // withHorizontalLabels={false}
                        withVerticalLabels={false}
                        hidePointsAtIndex={showData.data.map((t, i) => (t === 0) && i)}
                        yAxisInterval={1} // optional, defaults to 1
                        // yLabelsOffset={-25}
                        chartConfig={{
                            backgroundColor: '#e26a00',
                            backgroundGradientFrom: '#fb8c00',
                            backgroundGradientTo: '#ffa726',
                            // decimalPlaces: 0, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            // style: {
                            //
                            // },
                            strokeWidth: 2.5,
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                        // withDots={false}
                        fromZero={true}
                        withInnerLines={false}
                        withOuterLines={false}
                        strokeWidth={3}
                    />
                )}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    title: {
        fontSize: 20,
    },
    fab: {
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 10,
    },
    listTitle: {
        fontSize: 20,
    },
});

export default HomeScreen;
