import {React, into,TestUtils,expect,byTypes, select,  Simulate}  from '../support';
import Subschema, {Form, types, ValueManager, loaderFactory, DefaultLoader} from 'Subschema';

var Select = types.Select;
var CarMakeSetup = require('../../public/samples/CarMake-setup.js');
var CarMake = require('../../public/samples/CarMake.js');

describe('CarMake', function () {
    it('should not be selectable', function () {
        var schema = CarMake.schema;
        //loader, schema, Subschema, React
        var loader = loaderFactory([DefaultLoader]);
        expect(CarMake).toExist('CarMake-setup should load');
        var valueManager = ValueManager();
        CarMakeSetup(loader, schema, Subschema, React, valueManager);

        var form = into(<Form schema={schema} valueManager={valueManager}/>);

        var selects = byTypes(form, Select);
        expect(selects.length).toBe(2, 'should have 2 selects');
        select(selects[0], 1);
        expect(valueManager.path('make')).toBe('amc');
        var selects = byTypes(form, Select);
        expect(selects[1].props.placeholder).toBe('Select a model of AMC');
        select(selects[1], 2);
        expect(valueManager.path('model')).toBe('Concord');

    })
});