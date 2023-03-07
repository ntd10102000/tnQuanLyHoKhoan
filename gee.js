
var before_start= '2020-09-01';
var before_end='2020-10-01';
// Bây giờ thiết lập các thông số tương tự cho SAU cơn lũ.
var after_start='2020-09-23';
var after_end='2020-10-23';
// LẤY RANH GIỚI KHU VỰC LƯU VÀO BIẾN aoi
    // Lấy khu vực ranh giới theo tỉnh
var urban = ee.FeatureCollection("FAO/GAUL_SIMPLIFIED_500m/2015/level2");
var pt = urban.filter(ee.Filter.eq('ADM1_NAME', 'Hai Duong'));
    // lấy khu vực ranh giới teho huyện
var urban = ee.FeatureCollection("FAO/GAUL_SIMPLIFIED_500m/2015/level2");
var pt = urban.filter(ee.Filter.eq('ADM2_NAME', 'Vu Quang'));
var geometry = pt.geometry()
var aoi = ee.FeatureCollection(geometry);// trường hợp khoanh vùng trên bản đồ cũng lưu vùng vào biến aoi
// các tham số truyển vào là before_start,before_end,after_start,after_end và aoi
// BẮT ĐẦU CỦA LẤY DỮ LIỆU VÀ XỬ LÝ LŨ LỤT
// thiết lập các biến dùng trong lọc ảnh ( dự án này để mặc định theo dưới đây)
var polarization = "VH"; 
var pass_direction = "DESCENDING";
var difference_threshold = 1.25;
// Before and after flood SAR mosaic  // Khảm SAR trước và sau lũ lụt

// Tải và lọc dữ liệu Sentinel-1 GRD theo các tham số xác định trước
var collection= ee.ImageCollection('COPERNICUS/S1_GRD')
  .filter(ee.Filter.eq('instrumentMode','IW'))
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', polarization))
  .filter(ee.Filter.eq('orbitProperties_pass',pass_direction)) 
  .filter(ee.Filter.eq('resolution_meters',10))
  .filterBounds(aoi)
  .select(polarization);
// // Lọc ảnh vệ tinh theo ngày được xác định trước trước lũ và sau lũ vào 2 biến before_collection, after_collection
var before_collection = collection.filterDate(before_start, before_end);
var after_collection = collection.filterDate(after_start,after_end);
// Tạo hình ảnh tổng hợp theo clip đã chọn cho khu vực nghiên cứu
var before = before_collection.mosaic().clip(aoi);
var after = after_collection.mosaic().clip(aoi);
 // Áp dụng giảm đốm radar bằng cách làm mịn
var smoothing_radius = 50;
var before_filtered = before.focal_mean(smoothing_radius, 'circle', 'meters');
var after_filtered = after.focal_mean(smoothing_radius, 'circle', 'meters');
 // Tính toán sự khác biệt giữa hình ảnh trước và sau
var difference = after_filtered.divide(before_filtered);
// Áp dụng ngưỡng chênh lệch được xác định trước và tạo mặt nạ mức độ ngập lụt
var threshold = difference_threshold;
var difference_binary = difference.gt(threshold);
// Tinh chỉnh kết quả lũ lụt bằng cách sử dụng tập dữ liệu bổ sung
// Bao gồm lớp JRC trên tính theo mùa của nước bề mặt để che các pixel lũ khỏi các khu vực 
//có nước "vĩnh viễn" (nơi có nước> 10 tháng trong năm)
      var swater = ee.Image('JRC/GSW1_0/GlobalSurfaceWater').select('seasonality');
      var swater_mask = swater.gte(10).updateMask(swater.gte(10));
// Lớp ngập nước nơi các vùng nước lâu năm (nước> 10 tháng / năm) được gán giá trị 0
      var flooded_mask = difference_binary.where(swater_mask,0);
      // khu vực ngập lụt cuối cùng không có pixel trong các vùng nước lâu năm
      var flooded = flooded_mask.updateMask(flooded_mask);
      // Tính toán kết nối của các pixel để loại bỏ những pixel được kết nối với 8 hoặc ít hơn các hàng xóm
      // Hoạt động này làm giảm tiếng ồn của sản phẩm phạm vi lũ
      var connections = flooded.connectedPixelCount();    
      var flooded = flooded.updateMask(connections.gte(8));
      // Che dấu các khu vực có độ dốc hơn 5 phần trăm bằng Mô hình độ cao kỹ thuật số
      var DEM = ee.Image('WWF/HydroSHEDS/03VFDEM');
      var terrain = ee.Algorithms.Terrain(DEM);
      var slope = terrain.select('slope');
      var flooded = flooded.updateMask(slope.lt(5));

var visParams = {min:[-25, -25, 0] ,max:[0, 0, 2]}
// phẩn hiển thị các lớp lên bản đồ, mỗi lớp hiên thị dạng layer cho phép bật tắt các layer khi xem lũ lụt
Map.centerObject(aoi,8); // lấy trung tâm bản đồ tự zoom về vị trí của geometry aoi
Map.addLayer(before_filtered, visParams, 'Before Flood',0);// hiển thị trước lũ
Map.addLayer(after_filtered,visParams, 'After Flood',1);// hiển thị sau khi lũ
var beforeFiltered = ee.Image(toDB(RefinedLee(toNatural(before))))
var afterFiltered = ee.Image(toDB(RefinedLee(toNatural(after))))

Map.addLayer(beforeFiltered, {min:-25,max:0}, 'Before Filtered', false);
Map.addLayer(afterFiltered, {min:-25,max:0}, 'After Filtered', false); 

Map.addLayer(difference,{min:0,max:1, palette: ['orange']},"Difference Layer",0);// hiển thị dữ liệu khác biệt
Map.addLayer(flooded,{min:0, max:1, palette: ['cyan']},'Flooded areas');// hiển thị dữ liệu lũ lụt

// Tính toán diện tích phạm vi lũ
// Tạo một lớp raster chứa thông tin diện tích của mỗi pixel
var flood_pixelarea = flooded.select(polarization)
  .multiply(ee.Image.pixelArea());
// Tính tổng diện tích các pixel bị ngập mặc định được đặt thành 'bestEffort: true' để giảm thời gian tính toán, để có thêm
// kết quả chính xác đặt bestEffort thành false và tăng 'maxPixels'.
var flood_stats = flood_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(),              
  geometry: aoi,
  scale: 10, // native resolution 
  //maxPixels: 1e9,
  bestEffort: true
  });
// Chuyển đổi phạm vi lũ lụt sang hecta (tính toán diện tích ban đầu được đưa ra bằng mét)
var flood_area_ha = flood_stats
  .getNumber(polarization)
  .divide(10000)
  .round();
// sau khi hiển thị bản đồ lũ lụt => cho phần hiển thị diện tích bị ngập/ tổng diện tích của vùng


//------------------------------  DAMAGE ASSSESSMENT  ----------------------------------//

//----------------------------- Exposed population density ----------------------------//

// Tải lớp Mật độ dân cư Định cư Con người Toàn cầu của JRC
// Độ phân giải: 250. Số người trên mỗi ô được đưa ra.
var population_count = ee.Image('JRC/GHSL/P2016/POP_GPW_GLOBE_V1/2015').clip(aoi);
// Tính lượng dân số tiếp xúc với phép chiếu GHSL
var GHSLprojection = population_count.projection();
// Tái phản chiếu lớp lũ sang tỷ lệ GHSL
var flooded_res1 = flooded
    .reproject({
    crs: GHSLprojection
  });
// Tạo một raster hiển thị dân số được hiển thị chỉ bằng cách sử dụng lớp lũ được lấy mẫu lại
var population_exposed = population_count
  .updateMask(flooded_res1)
  .updateMask(population_count);
// Tổng giá trị pixel của raster dân số được hiển thị
var stats = population_exposed.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: aoi,
  scale: 250,
  maxPixels:1e9 
});
// lấy số người được tiếp xúc dưới dạng số nguyên
var number_pp_exposed = stats.getNumber('population_count').round();

//----------------------------- Affected agricultural land ----------------------------//

// using MODIS Land Cover Type Yearly Global 500m
// filter image collection by the most up-to-date MODIS Land Cover product
// sử dụng loại đất phủ MODIS Toàn cầu hàng năm 500m
// lọc bộ sưu tập hình ảnh theo sản phẩm Bìa đất MODIS cập nhật nhất
var LC = ee.ImageCollection('MODIS/006/MCD12Q1')
  .filterDate('2014-01-01',after_end)
  .sort('system:index',false)
  .select("LC_Type1")
  .first()
  .clip(aoi);

// Extract only cropland pixels using the classes cropland (>60%) and Cropland/Natural 
// Vegetation Mosaics: mosaics of small-scale cultivation 40-60% incl. natural vegetation
// Chỉ trích xuất các pixel đất trồng trọt bằng cách sử dụng các lớp đất trồng trọt (> 60%) và Cropland / Natural
// Ghép thực vật: khảm trồng trọt quy mô nhỏ 40-60% bao gồm. Thảm thực vật tự nhiên
var cropmask = LC
  .eq(12)
  .or(LC.eq(14))
var cropland = LC
  .updateMask(cropmask)
  
// get MODIS projection // get MODIS projection
var MODISprojection = LC.projection();

// Reproject flood layer to MODIS scale // Tái phản chiếu lớp lũ sang tỷ lệ MODIS
var flooded_res = flooded
    .reproject({
    crs: MODISprojection
  });

// Calculate affected cropland using the resampled flood layer 
// Tính diện tích đất trồng trọt bị ảnh hưởng bằng cách sử dụng lớp lũ được lấy mẫu lại
var cropland_affected = flooded_res
  .updateMask(cropland)

// get pixel area of affected cropland layer // lấy diện tích pixel của lớp đất trồng trọt bị ảnh hưởng
var crop_pixelarea = cropland_affected
  .multiply(ee.Image.pixelArea()); //calcuate the area of each pixel  // tính diện tích của mỗi pixel

// sum pixels of affected cropland layer // tổng số pixel của lớp đất trồng trọt bị ảnh hưởng
var crop_stats = crop_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(), //sum all pixels with area information // tính tổng tất cả các pixel với thông tin khu vực         
  geometry: aoi,
  scale: 500,
  maxPixels: 1e9
  });
  
// convert area to hectares // chuyển đổi diện tích sang hecta
var crop_area_ha = crop_stats
  .getNumber(polarization)
  .divide(10000)
  .round();

//-------------------------------- Affected urban area ------------------------------//

// Using the same MODIS Land Cover Product 
// Filter urban areas 
// Sử dụng cùng một Sản phẩm Bìa đất MODIS
// Lọc các khu vực thành thị
var urbanmask = LC.eq(13)
var urban = LC
  .updateMask(urbanmask)

//Calculate affected urban areas using the resampled flood layer
// Tính toán các khu vực đô thị bị ảnh hưởng bằng cách sử dụng lớp lũ được lấy mẫu lại
var urban_affected = urban
  .mask(flooded_res)
  .updateMask(urban);

// get pixel area of affected urban layer // lấy khu vực pixel của lớp thành thị bị ảnh hưởng
var urban_pixelarea = urban_affected
  .multiply(ee.Image.pixelArea()); //calcuate the area of each pixel// tính diện tích của mỗi pixel

// sum pixels of affected cropland layer // tổng số pixel của lớp đất trồng trọt bị ảnh hưởng
var urban_stats = urban_pixelarea.reduceRegion({
  reducer: ee.Reducer.sum(), //sum all pixels with area information // tính tổng tất cả các pixel với thông tin khu vực            
  geometry: aoi,
  scale: 500,
  bestEffort: true,
  });

// convert area to hectares // chuyển đổi diện tích sang hecta
var urban_area_ha = urban_stats
  .getNumber('LC_Type1')
  .divide(10000)
  .round();

//------------------------------  DISPLAY PRODUCTS  ----------------------------------//


// Population Density / Mật độ dân số
var populationCountVis = {
  min: 0,
  max: 200.0,
  palette: ['060606','337663','337663','ffffff'],
};
Map.addLayer(population_count, populationCountVis, 'Population Density',0);

// Exposed Population // Dân số tiếp xúc
var populationExposedVis = {
  min: 0,
  max: 200.0,
  palette: ['yellow', 'orange', 'red'],
};
Map.addLayer(population_exposed, populationExposedVis, 'Exposed Population');

// MODIS Land Cover // Lớp phủ đất MODIS
var LCVis = {
  min: 1.0,
  max: 17.0,
  palette: [
    '05450a', '086a10', '54a708', '78d203', '009900', 'c6b044', 'dcd159',
    'dade48', 'fbff13', 'b6ff05', '27ff87', 'c24f44', 'a5a5a5', 'ff6d4c',
    '69fff8', 'f9ffa4', '1c0dff'
  ],
};
Map.addLayer(LC, LCVis, 'Land Cover',0);

// Cropland // Đất trồng trọt
var croplandVis = {
  min: 0,
  max: 14.0,
  palette: ['30b21c'],
};
Map.addLayer(cropland, croplandVis, 'Cropland',0)

// Affected cropland // Đất trồng trọt bị ảnh hưởng
Map.addLayer(cropland_affected, croplandVis, 'Affected Cropland'); 

// Urban Đô thị
var urbanVis = {
  min: 0,
  max: 13.0,
  palette: ['grey'],
};
Map.addLayer(urban, urbanVis, 'Urban',0)

// Affected urban // Thành thị bị ảnh hưởng
Map.addLayer(urban_affected, urbanVis, 'Affected Urban'); 


//------------------------------------- EXPORTS ------------------------------------//
// Export flooded area as TIFF file 
Export.image.toDrive({
  image: flooded, 
  description: 'Flood_extent_raster',
  fileNamePrefix: 'flooded',
  region: aoi, 
  maxPixels: 1e10
});

// Export flooded area as shapefile (for further analysis in e.g. QGIS)
// Convert flood raster to polygons
var flooded_vec = flooded.reduceToVectors({
  scale: 10,
  geometryType:'polygon',
  geometry: aoi,
  eightConnected: false,
  bestEffort:true,
  tileScale:2,
});

// Export flood polygons as shape-file
Export.table.toDrive({
  collection:flooded_vec,
  description:'Flood_extent_vector',
  fileFormat:'SHP',
  fileNamePrefix:'flooded_vec'
});

// Export auxcillary data as shp?
// Exposed population density
Export.image.toDrive({
  image:population_exposed,
  description:'Exposed_Populuation',
  scale: 250,
  fileNamePrefix:'population_exposed',
  region: aoi,
  maxPixels:1e10
});

//---------------------------------- MAP PRODUCTION --------------------------------//

//-------------------------- Display the results on the map -----------------------//

// set position of panel where the results will be displayed  đặt vị trí của bảng nơi kết quả sẽ được hiển thị
var results = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px',
    width: '350px'
  }
});

//Prepare the visualtization parameters of the labels  // Chuẩn bị các thông số hiển thị của nhãn
var textVis = {
  'margin':'0px 8px 2px 0px',
  'fontWeight':'bold'
  };
var numberVIS = {
  'margin':'0px 0px 15px 0px', 
  'color':'bf0f19',
  'fontWeight':'bold'
  };
var subTextVis = {
  'margin':'0px 0px 2px 0px',
  'fontSize':'12px',
  'color':'grey'
  };

var titleTextVis = {
  'margin':'0px 0px 15px 0px',
  'fontSize': '18px', 
  'font-weight':'', 
  'color': '3333ff'
  };

// Create lables of the results 
// Titel and time period
var title = ui.Label('Results', titleTextVis);
var text1 = ui.Label('Flood status between:',textVis);
var number1 = ui.Label(after_start.concat(" and ",after_end),numberVIS);

// Alternatively, print dates of the selected tiles
//var number1 = ui.Label('Please wait...',numberVIS); 
//(after_collection).evaluate(function(val){number1.setValue(val)}),numberVIS;

// Estimated flood extent 
var text2 = ui.Label('Estimated flood extent:',textVis);
var text2_2 = ui.Label('Please wait...',subTextVis);
// dates(after_collection).evaluate(function(val){text2_2.setValue('based on Senintel-1 imagery '+val)});
var number2 = ui.Label('Please wait...',numberVIS); 
flood_area_ha.evaluate(function(val){number2.setValue(val+' hectares')}),numberVIS;

// Estimated number of exposed people
var text3 = ui.Label('Estimated number of exposed people: ',textVis);
var text3_2 = ui.Label('based on GHSL 2015 (250m)',subTextVis);
var number3 = ui.Label('Please wait...',numberVIS);
number_pp_exposed.evaluate(function(val){number3.setValue(val)}),numberVIS;

// Estimated area of affected cropland 
var MODIS_date = ee.String(LC.get('system:index')).slice(0,4);
var text4 = ui.Label('Estimated affected cropland:',textVis);
var text4_2 = ui.Label('Please wait', subTextVis)
MODIS_date.evaluate(function(val){text4_2.setValue('based on MODIS Land Cover '+val +' (500m)')}), subTextVis;
var number4 = ui.Label('Please wait...',numberVIS);
crop_area_ha.evaluate(function(val){number4.setValue(val+' hectares')}),numberVIS;

// Estimated area of affected urban
var text5 = ui.Label('Estimated affected urban areas:',textVis);
var text5_2 = ui.Label('Please wait', subTextVis)
MODIS_date.evaluate(function(val){text5_2.setValue('based on MODIS Land Cover '+val +' (500m)')}), subTextVis;
var number5 = ui.Label('Please wait...',numberVIS);
urban_area_ha.evaluate(function(val){number5.setValue(val+' hectares')}),numberVIS;

// Disclaimer
var text6 = ui.Label('Disclaimer: This product has been derived automatically without validation data. All geographic information has limitations due to the scale, resolution, date and interpretation of the original source materials. No liability concerning the content or the use thereof is assumed by the producer.',subTextVis)

// Produced by...
var text7 = ui.Label('Script produced by: UN-SPIDER December 2019', subTextVis)

// Add the labels to the panel 
results.add(ui.Panel([
        title,
        text1,
        number1,
        text2,
        text2_2,
        number2,
        text3,
        text3_2,
        number3,
        text4,
        text4_2,
        number4,
        text5,
        text5_2,
        number5,
        text6,
        text7]
      ));

// Add the panel to the map 
Map.add(results);

//----------------------------- Display legend on the map --------------------------//

// Create legend (*credits to thisearthsite on Open Geo Blog: https://mygeoblog.com/2016/12/09/add-a-legend-to-to-your-gee-map/)
// set position of panel
var legend = ui.Panel({
  style: {
    position: 'bottom-right',
    padding: '8px 15px',
  }
});
 
// Create legend title
var legendTitle = ui.Label('Legend',titleTextVis);
 
// Add the title to the panel
legend.add(legendTitle);
 
// Creates and styles 1 row of the legend.
var makeRow = function(color, name) {
 
      // Create the label that is actually the colored box.
      var colorBox = ui.Label({
        style: {
          backgroundColor: color,
          // Use padding to give the box height and width.
          padding: '8px',
          margin: '0 0 4px 0'
        }
      });
 
      // Create the label filled with the description text.
      var description = ui.Label({
        value: name,
        style: {margin: '0 0 4px 6px'}
      });
 
      // return the panel
      return ui.Panel({
        widgets: [colorBox, description],
        layout: ui.Panel.Layout.Flow('horizontal')
      });
};
 
//  Palette with the colors
var palette =['#0000FF', '#30b21c', 'grey'];
 
// name of the legend
var names = ['potentially flooded areas','affected cropland','affected urban'];
 
// Add color and and names
for (var i = 0; i < 3; i++) {
  legend.add(makeRow(palette[i], names[i]));
  }  

// Create second legend title to display exposed population density
var legendTitle2 = ui.Label({
value: 'Exposed population density',
style: {
fontWeight: 'bold',
fontSize: '15px',
margin: '10px 0 0 0',
padding: '0'
}
});

// Add second title to the panel
legend.add(legendTitle2);

// create the legend image
var lon = ee.Image.pixelLonLat().select('latitude');
var gradient = lon.multiply((populationExposedVis.max-populationExposedVis.min)/100.0).add(populationExposedVis.min);
var legendImage = gradient.visualize(populationExposedVis);
 
// create text on top of legend
var panel = ui.Panel({
widgets: [
ui.Label('> '.concat(populationExposedVis['max']))
],
});
 
legend.add(panel);
 
// create thumbnail from the image
var thumbnail = ui.Thumbnail({
image: legendImage,
params: {bbox:'0,0,10,100', dimensions:'10x50'},
style: {padding: '1px', position: 'bottom-center'}
});
 
// add the thumbnail to the legend
legend.add(thumbnail);
 
// create text on top of legend
var panel = ui.Panel({
widgets: [
ui.Label(populationExposedVis['min'])
],
});
 
legend.add(panel);
 
// add legend to map (alternatively you can also print the legend to the console)
Map.add(legend);