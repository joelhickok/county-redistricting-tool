export default {
    layers: [{
        'currentVersion': 10.51,
        'id': 0,
        'name': 'Polygon layer',
        'type': 'Feature Layer',
        'displayField': '',
        'description': '',
        'copyrightText': '',
        'defaultVisibility': true,
        'editingInfo': {
            'lastEditDate': 1526947149828
        },
        'relationships': [],
        'isDataVersioned': false,
        'supportsAppend': true,
        'supportsCalculate': true,
        'supportsTruncate': true,
        'supportsAttachmentsByUploadId': true,
        'supportsAttachmentsResizing': true,
        'supportsRollbackOnFailureParameter': true,
        'supportsStatistics': true,
        'supportsAdvancedQueries': true,
        'supportsValidateSql': true,
        'supportsCoordinatesQuantization': true,
        'supportsApplyEditsWithGlobalIds': false,
        'supportsMultiScaleGeometry': true,
        'hasGeometryProperties': true,
        'geometryProperties': {
            'shapeAreaFieldName': 'Shape__Area',
            'shapeLengthFieldName': 'Shape__Length',
            'units': 'esriMeters'
        },
        'advancedQueryCapabilities': {
            'supportsPagination': true,
            'supportsPaginationOnAggregatedQueries': true,
            'supportsQueryRelatedPagination': true,
            'supportsQueryWithDistance': true,
            'supportsReturningQueryExtent': true,
            'supportsStatistics': true,
            'supportsOrderBy': true,
            'supportsDistinct': true,
            'supportsQueryWithResultType': true,
            'supportsSqlExpression': true,
            'supportsAdvancedQueryRelated': true,
            'supportsCountDistinct': true,
            'supportsLod': true,
            'supportsReturningGeometryCentroid': true,
            'supportsReturningGeometryProperties': true,
            'supportsQueryWithDatumTransformation': true,
            'supportsHavingClause': true,
            'supportsOutFieldSQLExpression': true
        },
        'useStandardizedQueries': true,
        'geometryType': 'esriGeometryPolygon',
        'minScale': 0,
        'maxScale': 0,
        'extent': {
            'xmin': -20037508.342788905,
            'ymin': -8175201.3721496435,
            'xmax': -9549097.23973764,
            'ymax': 12175461.54272524,
            'spatialReference': {
                'wkid': 102100
            }
        },
        'drawingInfo': {"renderer":{"visualVariables":[{"type":"sizeInfo","target":"outline","expression":"view.scale","valueExpression":"$view.scale","stops":[{"size":1.5,"value":39148},{"size":0.75,"value":122337},{"size":0.375,"value":489347},{"size":0,"value":978694}]}],"type":"uniqueValue","field1":"District","defaultSymbol":{"color":[255,255,0,255],"outline":{"color":[153,153,153,64],"width":0.75,"type":"esriSLS","style":"esriSLSSolid"},"type":"esriSFS","style":"esriSFSSolid"},"defaultLabel":"Other","uniqueValueInfos":[{"value":"0","symbol":{"color":null,"outline":{"color":[153,153,153,64],"width":0.75,"type":"esriSLS","style":"esriSLSSolid"},"type":"esriSFS","style":"esriSFSSolid"},"label":"0"},{"value":"1","symbol":{"color":[143,9,10,255],"outline":{"color":[153,153,153,64],"width":0.75,"type":"esriSLS","style":"esriSLSSolid"},"type":"esriSFS","style":"esriSFSSolid"},"label":"1"},{"value":"4","symbol":{"color":[152,78,163,255],"outline":{"color":[153,153,153,64],"width":0.75,"type":"esriSLS","style":"esriSLSSolid"},"type":"esriSFS","style":"esriSFSSolid"},"label":"4"},{"value":"3","symbol":{"color":[77,175,74,255],"outline":{"color":[153,153,153,64],"width":0.75,"type":"esriSLS","style":"esriSLSSolid"},"type":"esriSFS","style":"esriSFSSolid"},"label":"3"},{"value":"2","symbol":{"color":[55,126,184,255],"outline":{"color":[153,153,153,64],"width":0.75,"type":"esriSLS","style":"esriSLSSolid"},"type":"esriSFS","style":"esriSFSSolid"},"label":"2"},{"value":"5","symbol":{"color":[255,127,0,255],"outline":{"color":[153,153,153,64],"width":0.75,"type":"esriSLS","style":"esriSLSSolid"},"type":"esriSFS","style":"esriSFSSolid"},"label":"5"}]},"transparency":20},
        'allowGeometryUpdates': true,
        'hasAttachments': true,
        'htmlPopupType': 'esriServerHTMLPopupTypeNone',
        'hasM': false,
        'hasZ': false,
        'objectIdField': 'OBJECTID',
        'uniqueIdField': {
            'name': 'OBJECTID',
            'isSystemMaintained': true
        },
        'globalIdField': '',
        'typeIdField': '',
        'fields': [{
            'name': 'OBJECTID',
            'type': 'esriFieldTypeOID',
            'alias': 'OBJECTID',
            'sqlType': 'sqlTypeOther',
            'nullable': false,
            'editable': false,
            'domain': null,
            'defaultValue': null
        }],
        'indexes': [],
        'types': [],
        'templates': [{
            'name': 'New Feature',
            'description': '',
            'drawingTool': 'esriFeatureEditToolPolygon',
            'prototype': {
                'attributes': {}
            }
        }],
        'supportedQueryFormats': 'JSON, geoJSON',
        'hasStaticData': false,
        'maxRecordCount': 2000,
        'standardMaxRecordCount': 4000,
        'tileMaxRecordCount': 4000,
        'maxRecordCountFactor': 1,
        'capabilities': 'Query,Editing,Create,Update,Delete,Sync',
        'syncEnabled': true,
        'adminLayerInfo': {
            'geometryField': {
                'name': 'Shape',
                'srid': 102100
            }
        }
    }],
    'tables': []
}
