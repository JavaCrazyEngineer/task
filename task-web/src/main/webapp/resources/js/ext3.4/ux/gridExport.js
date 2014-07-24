/**
 * allows for downloading of grid data (store) directly into excel
 * Method: extracts data of gridPanel store, uses columnModel to construct XML excel document,
 * converts to Base64, then loads everything into a data URL link.
 *
 * @author		Animal		<extjs support team>
 *
 */
 
/**
 * 将json转化成url参数
 *
 */
var jsonToUrlParams = function(json) {   
    if (!json && Ext.isEmpty(json)) {   
        return '';   
    }   
       
    var tmps = [];   
    for (var key in json) {   
        tmps.push(key + '=' + json[key]);   
    }   
       
    return tmps.join('&');   
}   
/**
 * base64 encode / decode
 *
 * @location 	http://www.webtoolkit.info/
 *
 */
var Base64 = (function() {
    // Private property
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // Private method for UTF-8 encoding
    function utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }

    // Public method for encoding
    return {
        encode : (typeof btoa == 'function') ? function(input) {
            return btoa(utf8Encode(input));
        } : function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = utf8Encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                keyStr.charAt(enc3) + keyStr.charAt(enc4);
            }
            return output;
        }
    };
})();

Ext.override(Ext.grid.GridPanel, {
    getExcelXml: function(includeHidden) {
        var worksheet = this.createWorksheet(includeHidden);
        var totalWidth = this.getColumnModel().getTotalWidth(includeHidden);
        return '<xml version="1.0" encoding="utf-8">' +
            '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:o="urn:schemas-microsoft-com:office:office">' +
            '<o:DocumentProperties><o:Title>' + this.title + '</o:Title></o:DocumentProperties>' +
            '<ss:ExcelWorkbook>' +
            '<ss:WindowHeight>' + worksheet.height + '</ss:WindowHeight>' +
            '<ss:WindowWidth>' + worksheet.width + '</ss:WindowWidth>' +
            '<ss:ProtectStructure>False</ss:ProtectStructure>' +
            '<ss:ProtectWindows>False</ss:ProtectWindows>' +
            '</ss:ExcelWorkbook>' +
            '<ss:Styles>' +
            '<ss:Style ss:ID="Default">' +
            '<ss:Alignment ss:Vertical="Top" ss:WrapText="1" />' +
            '<ss:Font ss:FontName="arial" ss:Size="10" />' +
            '<ss:Borders>' +
            '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Top" />' +
            '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Bottom" />' +
            '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Left" />' +
            '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Right" />' +
            '</ss:Borders>' +
            '<ss:Interior />' +
            '<ss:NumberFormat />' +
            '<ss:Protection />' +
            '</ss:Style>' +
            '<ss:Style ss:ID="title">' +
            '<ss:Borders />' +
            '<ss:Font />' +
            '<ss:Alignment ss:WrapText="1" ss:Vertical="Center" ss:Horizontal="Center" />' +
            '<ss:NumberFormat ss:Format="@" />' +
            '</ss:Style>' +
            '<ss:Style ss:ID="headercell">' +
            '<ss:Font ss:Bold="1" ss:Size="10" />' +
            '<ss:Alignment ss:WrapText="1" ss:Horizontal="Center" />' +
            '<ss:Interior ss:Pattern="Solid" ss:Color="#A3C9F1" />' +
            '</ss:Style>' +
            '<ss:Style ss:ID="even">' +
            '<ss:Interior ss:Pattern="Solid" ss:Color="#CCFFFF" />' +
            '</ss:Style>' +
            '<ss:Style ss:Parent="even" ss:ID="evendate">' +
            '<ss:NumberFormat ss:Format="yyyy-mm-dd" />' +
            '</ss:Style>' +
            '<ss:Style ss:Parent="even" ss:ID="evenint">' +
            '<ss:NumberFormat ss:Format="0" />' +
            '</ss:Style>' +
            '<ss:Style ss:Parent="even" ss:ID="evenfloat">' +
            '<ss:NumberFormat ss:Format="0.00" />' +
            '</ss:Style>' +
            '<ss:Style ss:ID="odd">' +
            '<ss:Interior ss:Pattern="Solid" ss:Color="#CCCCFF" />' +
            '</ss:Style>' +
            '<ss:Style ss:Parent="odd" ss:ID="odddate">' +
            '<ss:NumberFormat ss:Format="yyyy-mm-dd" />' +
            '</ss:Style>' +
            '<ss:Style ss:Parent="odd" ss:ID="oddint">' +
            '<ss:NumberFormat ss:Format="0" />' +
            '</ss:Style>' +
            '<ss:Style ss:Parent="odd" ss:ID="oddfloat">' +
            '<ss:NumberFormat ss:Format="0.00" />' +
            '</ss:Style>' +
            '</ss:Styles>' +
            worksheet.xml +
            '</ss:Workbook>';
    },
    createWorksheet: function(includeHidden) {
        // Calculate cell data types and extra class names which affect formatting
        var cellType = [];
        var cellTypeClass = [];
        var cm = this.getColumnModel();
        var totalWidthInPixels = 0;
        var colXml = '';
        var headerXml = '';
        var visibleColumnCountReduction = 0;
        var colCount = cm.getColumnCount();
        for (var i = 0; i < colCount; i++) {
            if ((cm.getDataIndex(i) != '')
                && (includeHidden || !cm.isHidden(i))) {
                var w = cm.getColumnWidth(i)
                totalWidthInPixels += w;
                if (cm.getColumnHeader(i) === ""){
                	cellType.push("None");
                	cellTypeClass.push("");
                	++visibleColumnCountReduction;
                }
                else
                {
                    colXml += '<ss:Column ss:AutoFitWidth="1" ss:Width="' + w + '" />';
                    headerXml += '<ss:Cell ss:StyleID="headercell">' +
                        '<ss:Data ss:Type="String">' + cm.getColumnHeader(i) + '</ss:Data>' +
                        '<ss:NamedCell ss:Name="Print_Titles" /></ss:Cell>';
                    var fld = this.store.recordType.prototype.fields.get(cm.getDataIndex(i));
                    
                    switch(fld.type) {
                        case "int":
                            cellType.push("Number");
                            cellTypeClass.push("int");
                            break;
                        case "float":
                            cellType.push("Number");
                            cellTypeClass.push("float");
                            break;
                        case "bool":
                        case "boolean":
                            cellType.push("String");
                            cellTypeClass.push("");
                            break;
                        case "date":
                            cellType.push("DateTime");
                            cellTypeClass.push("date");
                            break;
                        default:
                            cellType.push("String");
                            cellTypeClass.push("");
                            break;
                    }
                }
            }
        }
        var visibleColumnCount = cellType.length - visibleColumnCountReduction;

        var result = {
            height: 9000,
            width: Math.floor(totalWidthInPixels * 30) + 50
        };

        // Generate worksheet header details.
        var t = '<ss:Worksheet ss:Name="' + this.title + '">' +
            '<ss:Names>' +
            '<ss:NamedRange ss:Name="Print_Titles" ss:RefersTo="=\'' + this.title + '\'!R1:R2" />' +
            '</ss:Names>' +
            '<ss:Table x:FullRows="1" x:FullColumns="1"' +
            ' ss:ExpandedColumnCount="' + (visibleColumnCount + 2) +
            '" ss:ExpandedRowCount="' + (this.store.getCount() + 2) + '">' +
            colXml +
            '<ss:Row ss:Height="38">' +
            '<ss:Cell ss:StyleID="title" ss:MergeAcross="' + (visibleColumnCount - 1) + '">' +
            '<ss:Data xmlns:html="http://www.w3.org/TR/REC-html40" ss:Type="String">' +
            '<html:B>Generated by ExtJS</html:B></ss:Data><ss:NamedCell ss:Name="Print_Titles" />' +
            '</ss:Cell>' +
            '</ss:Row>' +
            '<ss:Row ss:AutoFitHeight="1">' +
            headerXml +
            '</ss:Row>';

        // Generate the data rows from the data in the Store
        for (var i = 0, it = this.store.data.items, l = it.length; i < l; i++) {
            t += '<ss:Row>';
            var cellClass = (i & 1) ? 'odd' : 'even';
            r = it[i].data;
            var k = 0;
            for (var j = 0; j < colCount; j++) {
                if ((cm.getDataIndex(j) != '')
                    && (includeHidden || !cm.isHidden(j))) {
                    var v = r[cm.getDataIndex(j)];alert(v)
                    if (cellType[k] !== "None") {
                        t += '<ss:Cell ss:StyleID="' + cellClass + cellTypeClass[k] + '"><ss:Data ss:Type="' + cellType[k] + '">';
                        if (cellType[k] == 'DateTime') {
                            t += v.format('Y-m-d');
                        } else {
                            t += v;
                        }
                        t +='</ss:Data></ss:Cell>';
                    }
                    k++;
                }
            }
            t += '</ss:Row>';
        }

        result.xml = t + '</ss:Table>' +
            '<x:WorksheetOptions>' +
            '<x:PageSetup>' +
            '<x:Layout x:CenterHorizontal="1" x:Orientation="Landscape" />' +
            '<x:Footer x:Data="Page &amp;P of &amp;N" x:Margin="0.5" />' +
            '<x:PageMargins x:Top="0.5" x:Right="0.5" x:Left="0.5" x:Bottom="0.8" />' +
            '</x:PageSetup>' +
            '<x:FitToPage />' +
            '<x:Print>' +
            '<x:PrintErrors>Blank</x:PrintErrors>' +
            '<x:FitWidth>1</x:FitWidth>' +
            '<x:FitHeight>32767</x:FitHeight>' +
            '<x:ValidPrinterInfo />' +
            '<x:VerticalResolution>600</x:VerticalResolution>' +
            '</x:Print>' +
            '<x:Selected />' +
            '<x:DoNotDisplayGridlines />' +
            '<x:ProtectObjects>False</x:ProtectObjects>' +
            '<x:ProtectScenarios>False</x:ProtectScenarios>' +
            '</x:WorksheetOptions>' +
            '</ss:Worksheet>';
        return result;
    },
    getGridHtml: function(includeHidden) {
        var worksheet = this.createWorksheetHtml(includeHidden);//分页导出
        //var worksheet = this.createWorksheetNoPageHtml(includeHidden);//不分页导出，性能相对差
        return worksheet;
    },
    createWorksheetHtml: function(includeHidden) {
        // Calculate cell data types and extra class names which affect formatting
        var cellType = [];
        var cellTypeClass = [];
        var cm = this.getColumnModel();
        var totalWidthInPixels = 0;
        var headerXml = '<tr>';
        var visibleColumnCountReduction = 0;
        var colCount = cm.getColumnCount();
        
        for (var i = 0; i < colCount; i++) {
            if ((cm.getDataIndex(i) != '')
                && (includeHidden || !cm.isHidden(i))) {
                var w = cm.getColumnWidth(i)
                totalWidthInPixels += w;
                if (cm.getColumnHeader(i) === ""){
                	cellType.push("None");
                	cellTypeClass.push("");
                	++visibleColumnCountReduction;
                }
                else
                {
                    headerXml += '<td witdh="' + w + '" align="center" bgcolor="#CCFFFF">' + cm.getColumnHeader(i) + '</td>';
                    var fld = this.store.recordType.prototype.fields.get(cm.getDataIndex(i));
                    switch(fld.type.type) {
                        case "int":
                            cellType.push("Number");
                            cellTypeClass.push("int");
                            break;
                        case "float":
                            cellType.push("Number");
                            cellTypeClass.push("float");
                            break;
                        case "bool":
                        case "boolean":
                            cellType.push("String");
                            cellTypeClass.push("");
                            break;
                        case "date":
                            cellType.push("DateTime");
                            cellTypeClass.push("date");
                            break;
                        default:
                            cellType.push("String");
                            cellTypeClass.push("");
                            break;
                    }
                }
            }
        }
        headerXml += '</tr>';
        var visibleColumnCount = cellType.length - visibleColumnCountReduction;
        // Generate worksheet header details.
        var t = '';

        // Generate the data rows from the data in the Store
        for (var i = 0, it = this.store.data.items, l = it.length; i < l; i++) {
            var cellClass = (i & 1) ? '"#CDCDCD"' : '#FFFFFF"';
            t += '<tr>';
            //r = it[i].data;
            var k = 0;
            
            for (var j = 0; j < colCount; j++) {
                if ((cm.getDataIndex(j) != '')
                    && (includeHidden || !cm.isHidden(j))) {
                    //var v = r[cm.getDataIndex(j)];
                    var v = this.getView().getCell(i,j).innerText;
                    if (cellType[k] !== "None") {
                        t += '<td align="left">';
                        if (cellType[k] == 'DateTime') {
                            t += new Date(v).format('Y-m-d H:i:s');
                        } else {
                            t += v;
                        }
                        t +='</td>';
                    }
                    k++;
                }
            }
            t += '</tr>';
        }
        var result = {
            title:(!this.title?'export':this.title),
            data:null
        };
        result.data ='<table width="100%" style="border-collapse:collapse;">' +
	            '<tr height="30">' +
	            '<td colspan="'+visibleColumnCount+'" align="center"><strong>' + (!this.title?'export':this.title) + '</strong></td>' +
	            '</tr>' +
	             headerXml + t +
	            '</table>'
        return result;
    },
    createWorksheetNoPageHtml: function(includeHidden) {
        // Calculate cell data types and extra class names which affect formatting
        var cellType = [];
        var cellTypeClass = [];
        var cm = this.getColumnModel();
        var totalWidthInPixels = 0;
        var headerHtml = '<tr>';
        var visibleColumnCountReduction = 0;
        var colCount = cm.getColumnCount();
        var tmpStore = this.store;
        var tmpParam = Ext.ux.constructor(tmpStore.lastOptions);//此处克隆了原网格数据源的参数信息   
        //此处作者原先为Ext.ux.clone(tmpStore.lastOptions)方法，但不好使   
        if (tmpParam && tmpParam.params) {   
            delete (tmpParam.params[tmpStore.paramNames.start]);//删除分页参数   
            delete (tmpParam.params[tmpStore.paramNames.limit]);   
            Ext.applyIf(tmpParam.params,{start:0,limit:tmpStore.getTotalCount()});
        }   
        var tmpAllParams = jsonToUrlParams(tmpParam.params || tmpStore.baseParams);
        
        var tmpAllStore = new Ext.data.GroupingStore({//重新定义一个数据源   
            proxy:tmpStore.proxy,   
            reader:tmpStore.reader   
        }); 
        var tmpGrid = new Ext.grid.GridPanel({
            renderTo:Ext.getBody(),
            cm:cm,
            store:tmpAllStore,
            hidden:true
        });  
        //同步请求方法
	    var syncRequest = function() {  
	        var conn = Ext.lib.Ajax.getConnectionObject().conn;  
	        try {       
	             var url = tmpStore.proxy.url;
	             url = url.replace("tbdata","querytbdata");
	             url += url.indexOf("?")>-1?"&":"?";
	             conn.open("get", url+tmpAllParams, false);           
	             conn.send(null);       
	         } catch (e) {       
	             Ext.Msg.alert('动态获取表头失败！','error');       
	            return false;       
	         }    
	         return conn.responseText;
	    }   
	    
	    var data = Ext.util.JSON.decode(syncRequest());  
        tmpAllStore.loadData(data.tbdata || data);//获取所有数据   
        var visibleColumnCount = 0;
        for (var i = 0; i < colCount; i++) {
            if ((cm.getDataIndex(i) != '')
                && (includeHidden || !cm.isHidden(i))) {
                var w = cm.getColumnWidth(i)
                totalWidthInPixels += w;
                if (!Ext.isEmpty(cm.getColumnHeader(i))){
                    headerHtml += '<td witdh="' + w + '" align="center" bgcolor="#CCFFFF">' + cm.getColumnHeader(i) + '</td>';
                    visibleColumnCount++;
                }
            }
        }
        headerHtml += '</tr>';
        // Generate worksheet header details.
        var t = '';

        // Generate the data rows from the data in the Store
        for (var i = 0, it = tmpAllStore.data.items, l = it.length; i < l; i++) {
            t += '<tr>';
            var k = 0;
            for (var j = 0; j < colCount; j++) {
                if ((cm.getDataIndex(j) != '')
                    && (includeHidden || !cm.isHidden(j))) {
                    var v = tmpGrid.getView().getCell(i,j).innerText
                    t += '<td align="left">';
                    t += v;
                    t +='</td>';
                    k++;
                }
            }
            t += '</tr>';
        }
        var result = {
            title:(!this.title?'export':this.title),
            data:null
        };
        result.data ='<table width="100%" border="1px solid">' +
	            '<tr height="30">' +
	            '<td colspan="'+visibleColumnCount+'" align="center"><strong>' + (!this.title?'export':this.title) + '</strong></td>' +
	            '</tr>' +
	             headerHtml + t +
	            '</table>'
	    if(tmpGrid) tmpGrid.destroy();
        return result;
    },
    getGridJson: function(includeHidden) {
        var worksheet = this.createWorksheetJson(includeHidden);//分页导出
        //var worksheet = this.createWorksheetNoPageJson(includeHidden);//不分页导出
        return worksheet;
    },

    createWorksheetJson: function(includeHidden) {
        // Calculate cell data types and extra class names which affect formatting
        var cellType = [];
        var cellTypeClass = [];
        var cm = this.getColumnModel();
        var totalWidthInPixels = 0;
        var visibleColumnCountReduction = 0;
        var colCount = cm.getColumnCount();
        var headerItems = '';
        for (var i = 0; i < colCount; i++) {
            if ((cm.getDataIndex(i) != '')
                && (includeHidden || !cm.isHidden(i))) {
                var w = cm.getColumnWidth(i)+60;
                totalWidthInPixels += w;
                if (cm.getColumnHeader(i) === ""){
                	cellType.push("None");
                	cellTypeClass.push("");
                	++visibleColumnCountReduction;
                }
                else
                {
                    headerItems += ',{value:"'+cm.getColumnHeader(i)+'",width:'+w+'}';
                    var fld = this.store.recordType.prototype.fields.get(cm.getDataIndex(i));
                    switch(fld.type.type) {
                        case "int":
                            cellType.push("Number");
                            cellTypeClass.push("int");
                            break;
                        case "float":
                            cellType.push("Number");
                            cellTypeClass.push("float");
                            break;
                        case "bool":
                        case "boolean":
                            cellType.push("String");
                            cellTypeClass.push("");
                            break;
                        case "date":
                            cellType.push("DateTime");
                            cellTypeClass.push("date");
                            break;
                        default:
                            cellType.push("String");
                            cellTypeClass.push("");
                            break;
                    }
                }
            }
        }
        if(!Ext.isEmpty(headerItems)) headerItems = 'headerItems:['+headerItems.substring(1)+']';
        var visibleColumnCount = cellType.length - visibleColumnCountReduction;
        // Generate worksheet header details.
        var rowItems = '';
        // Generate the data rows from the data in the Store
        for (var i = 0, it = this.store.data.items, l = it.length; i < l; i++) {
            //r = it[i].data;
            var k = 0;
            var fieldItems = '';
            for (var j = 0; j < colCount; j++) {
                if ((cm.getDataIndex(j) != '')
                    && (includeHidden || !cm.isHidden(j))) {
                    //var v = r[cm.getDataIndex(j)];
                    var v = this.getView().getCell(i,j).innerText;
                    if (cellType[k] !== "None") {
                        if (cellType[k] == 'DateTime') {
                            fieldItems += ',value'+k+':"'+v.format('Y-m-d')+'"';
                        } else {
                            fieldItems += ',value'+k+':"'+v+'"';;
                        }
                    }
                    k++;
                }
            }
            if(!Ext.isEmpty(fieldItems)) fieldItems = '{'+fieldItems.substring(1)+'}';
            rowItems += ','+fieldItems;
        }
        if(!Ext.isEmpty(rowItems)) {
           rowItems = 'rowItems:['+rowItems.substring(1)+']';
        }else{
           rowItems = 'rowItems:[]';
        }
        var result = {
            title:(!this.title?'export':this.title),
            data:null
        };
        result.data = '{colCount:'+visibleColumnCount+','+headerItems + ',' + rowItems+'}'
        return result;
    },
    createWorksheetNoPageJson: function(includeHidden) {
        // Calculate cell data types and extra class names which affect formatting
        var cellType = [];
        var cellTypeClass = [];
        var cm = this.getColumnModel();
        var totalWidthInPixels = 0;
        var headerItems = '';
        var visibleColumnCountReduction = 0;
        var colCount = cm.getColumnCount();
        
        var tmpStore = this.store;
        var tmpParam = Ext.ux.constructor(tmpStore.lastOptions);//此处克隆了原网格数据源的参数信息   
             //此处作者原先为Ext.ux.clone(tmpStore.lastOptions)方法，但不好使   
        if (tmpParam && tmpParam.params) {   
            delete (tmpParam.params[tmpStore.paramNames.start]);//删除分页参数   
            delete (tmpParam.params[tmpStore.paramNames.limit]);   
            Ext.applyIf(tmpParam.params,{start:0,limit:tmpStore.getTotalCount()});
        }   
        var tmpAllStore = new Ext.data.GroupingStore({//重新定义一个数据源   
            proxy:tmpStore.proxy,   
            reader:tmpStore.reader   
        }); 
        var tmpGrid = new Ext.grid.GridPanel({
            renderTo:Ext.getBody(),
            cm:cm,
            store:tmpAllStore,
            hidden:true
        });  
        var tmpAllParams = jsonToUrlParams(tmpParam.params || tmpStore.baseParams);
        //同步请求方法
	    var syncRequest = function() {  
	        var conn = Ext.lib.Ajax.getConnectionObject().conn;  
	        try {       
	             var url = tmpStore.proxy.url;
	             url = url.replace("tbdata","querytbdata");
	             url += url.indexOf("?")>-1?"&":"?";
	             conn.open("get", url+tmpAllParams, false);       
	             conn.send(null);          
	         } catch (e) {       
	             Ext.Msg.alert('动态获取表头失败！','error');       
	            return false;       
	         }    
	         return conn.responseText;
	    }   
	    
	    var data = Ext.util.JSON.decode(syncRequest());  
        tmpAllStore.loadData(data.tbdata || data);//获取所有数据   
        var visibleColumnCount = 0;
        for (var i = 0; i < colCount; i++) {
            if ((cm.getDataIndex(i) != '')
                && (includeHidden || !cm.isHidden(i))) {
                var w = cm.getColumnWidth(i)
                totalWidthInPixels += w;
                if (!Ext.isEmpty(cm.getColumnHeader(i))){
                    headerItems += ',{value:"'+cm.getColumnHeader(i)+'",width:'+w+'}';
                    visibleColumnCount++;
                }
            }
        }
        if(!Ext.isEmpty(headerItems)) headerItems = 'headerItems:['+headerItems.substring(1)+']';
        // Generate worksheet header details.
        var rowItems = '';
        // Generate the data rows from the data in the Store
        for (var i = 0, it = tmpAllStore.data.items, l = it.length; i < l; i++) {
            var fieldItems = '';
            var k = 0;
            for (var j = 0; j < colCount; j++) {
                if ((cm.getDataIndex(j) != '')
                    && (includeHidden || !cm.isHidden(j))) {
                    var v = tmpGrid.getView().getCell(i,j).innerText
                    fieldItems += ',value'+k+':"'+v+'"';;
                    k++;
                }
            }
            if(!Ext.isEmpty(fieldItems)) fieldItems = '{'+fieldItems.substring(1)+'}';
            rowItems += ','+fieldItems;
        }
        if(!Ext.isEmpty(rowItems)) {
          rowItems = 'rowItems:['+rowItems.substring(1)+']';
        }else{
          rowItems = 'rowItems:[]';
        }  
        var result = {
            title:(!this.title?'export':this.title),
            data:null
        };
        result.data = '{colCount:'+visibleColumnCount+','+headerItems + ',' + rowItems+'}';
        if(tmpGrid) tmpGrid.destroy();
        return result;
    },
    /**
     *导出excel
     */
    exportExcel : function(){
       // var vExportContent = this.getGridHtml();
        var vExportContent = this.getGridJson();
        if (Ext.isIE8 || Ext.isIE7 || Ext.isIE6 || Ext.isSafari || Ext.isSafari2 || Ext.isSafari3) {
            var fd=Ext.get('frmDummyExcel');
            if (!fd) {
                fd=Ext.DomHelper.append(Ext.getBody(),
                    {tag:'form',method:'post',id:'frmDummyExcel',action:'pages/exportexcel1.jsp', target:'_blank',name:'frmDummyExcel',cls:'x-hidden',cn:[
                    {tag:'input',name:'exportContent',id:'exportContentExcel',type:'hidden'},
                    {tag:'input',name:'title',id:'titleExcel',type:'hidden'}
                ]},true);
            }
            fd.child('#exportContentExcel').set({value:encodeURIComponent(vExportContent.data)});
            fd.child('#titleExcel').set({value:encodeURIComponent(vExportContent.title)});
            fd.dom.submit();
        } else {
            document.location = 'data:application/vnd.ms-excel;base64,'+Base64.encode(vExportContent.data);
        }
    },
    /**
     *导出word
     */
    exportWord : function(){
        var vExportContent = this.getGridHtml();
        if (Ext.isIE8 || Ext.isIE7 || Ext.isIE6 || Ext.isSafari || Ext.isSafari2 || Ext.isSafari3) {
            var fd = Ext.get('frmDummyWord');
            if (!fd) {
                fd = Ext.DomHelper.append(Ext.getBody(),
                    {tag:'form',method:'post',id:'frmDummyWord',action:'pages/exportword.jsp', target:'_blank',name:'frmDummyWord',cls:'x-hidden',cn:[
                    {tag:'input',name:'exportContent',id:'exportContentWord',type:'hidden'},
                    {tag:'input',name:'title',id:'titleWord',type:'hidden'}
                ]},true);
            }
            fd.child('#exportContentWord').set({value:encodeURIComponent(vExportContent.data)});
            fd.child('#titleWord').set({value:encodeURIComponent(vExportContent.title)});
            fd.dom.submit();
        } else {
            document.location = 'data:application/ms-word;base64,'+Base64.encode(vExportContent.data);
        }
    },
    /**
     *导出pdf
     */
    exportPdf : function(){
        var vExportContent = this.getGridJson();
	    if (Ext.isIE8 || Ext.isIE7 || Ext.isIE6 || Ext.isSafari || Ext.isSafari2 || Ext.isSafari3) {
            var fd=Ext.get('frmDummyJson');
            if (!fd) {
                fd = Ext.DomHelper.append(Ext.getBody(),
                    {tag:'form',method:'post',id:'frmDummyJson',action:'pages/exportpdf.jsp', target:'_blank',name:'frmDummyJson',cls:'x-hidden',cn:[
                    {tag:'input',name:'exportContent',id:'exportContentJson',type:'hidden'},
                    {tag:'input',name:'title',id:'titleJson',type:'hidden'}
                ]},true);
            }
            fd.child('#exportContentJson').set({value:encodeURIComponent(vExportContent.data)});
            fd.child('#titleJson').set({value:encodeURIComponent(vExportContent.title)});
            fd.dom.submit();
        } else {
            document.location = 'data:application/pdf;base64,'+Base64.encode(vExportContent.data);
        }
    }
});
