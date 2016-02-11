"use strict";

import {React, byName, into,findNode, TestUtils,expect, byClass,Simulate, click, byTag, byTags, filterProp, byComponent, byComponents} from 'subschema-test-support';
import {templates, Form} from 'Subschema';
import Todos, {schema as Schema} from 'subschema-test-support/samples/Todos';

const {ButtonTemplate, ListItemTemplate, CollectionCreateTemplate, EditorTemplate} = templates;


describe('types/List', function () {
    this.timeout(50000);
    function add(root, c) {
        var allBtns = TestUtils.scryRenderedComponentsWithType(root, ButtonTemplate);
        var addBtn = findNode(allBtns[0]);

        click(addBtn);
        var create = byComponent(root, CollectionCreateTemplate);
        var input = byTag(create, 'input');
        Simulate.change(input, {target: {value: 'Hello, world ' + c}});
        var buttons = TestUtils.scryRenderedComponentsWithType(create, ButtonTemplate);
        expect(buttons[0]).toExist('buttons[0] does not exist');
        var btn = findNode(filterProp(buttons, 'action', 'submit')[0]);
        Simulate.click(btn);

        var value = root.getValue();
        expect(value.tasks[c]).toEqual('Hello, world ' + c);
        var tasks = byComponents(root, ListItemTemplate);
        return tasks[c];
    }

    function edit(root, c) {
        const tasks = byComponents(root, ListItemTemplate);
        const item = byClass(tasks[c], 'clickable')[0];
        click(item);
        const createTemplate = byComponent(root, CollectionCreateTemplate)
        const input = byName(createTemplate, `@tasks@${c}.value`);
        Simulate.change(input, {target: {value: 'Hello, world ' + c}});
        const btns = filterProp(TestUtils.scryRenderedComponentsWithType(createTemplate, ButtonTemplate), 'action', 'submit')
        Simulate.submit(btns[0]);
        const value = root.getValue();
        expect(input.value).toEqual('Hello, world ' + c);
        return tasks[c];
    }

    it('should render a list', function () {
        var root = into(<Form schema={Schema}/>);
        expect(root).toExist();
        var tasks = byComponents(root, ListItemTemplate);
        expect(tasks.length).toEqual(0);

    });

    it('should render a list with data the canAdd', function () {
        var data = {
            tasks: [
                'one',
                'two',
                'three'
            ]
        };
        var root = into(<Form schema={Schema} value={data}/>, true);
        expect(root).toExist();
        var addBtn = byClass(root, 'btn-add')[0];
        expect(addBtn).toExist();

        var tasks = byComponents(root, ListItemTemplate);


        expect(tasks[0].refs.buttons.refs.upBtn).toNotExist();
        expect(tasks[0].refs.buttons.refs.deleteBtn).toExist();
        expect(tasks[0].refs.buttons.refs.downBtn).toExist();
        expect(tasks[1].refs.buttons.refs.upBtn).toExist();
        expect(tasks[1].refs.buttons.refs.deleteBtn).toExist();
        expect(tasks[1].refs.buttons.refs.downBtn).toExist();

        expect(tasks[2].refs.buttons.refs.upBtn).toExist();
        expect(tasks[2].refs.buttons.refs.deleteBtn).toExist();
        expect(tasks[2].refs.buttons.refs.downBtn).toNotExist();


    });

    it('should render a list with data without canAdd', function () {
        var schema = {
            schema: {
                tasks: {
                    type: 'List',
                    itemType: 'Text',
                    canEdit: true,
                    canReorder: true,
                    canDelete: true
                }
            }
        }, data = {
            tasks: [
                'one',
                'two',
                'three'
            ]
        }
        var root = into(<Form schema={schema} value={data}/>, true);
        var tasks = byComponents(root, ListItemTemplate);
        var addBtn = byClass(root, 'btn-add')[0];

        expect(addBtn).toNotExist('add button does not exist');
        expect(tasks[0]).toExist('task 1');
        expect(tasks[1]).toExist('task 2');
        expect(tasks[2]).toExist('task 3');
        var span = byClass(tasks[0], 'clickable')[0];
        click(span);

        var edit = byComponent(root, CollectionCreateTemplate);
        expect(edit).toExist('should find CollectionCreateTemplate');
        var input = byName(edit, '@tasks@0.value');
        expect(findNode(input).value).toBe('one', 'value should be one');

    });
    it('should render a list with data is not editable', function () {
        var schema = {
            schema: {
                tasks: {
                    type: 'List',
                    itemType: 'Text'
                }
            }
        }, data = {
            tasks: [
                'one',
                'two',
                'three'
            ]
        }
        var root = into(<Form schema={schema} value={data}/>);
        var addBtn = byClass(root, 'btn-add')[0];

        expect(addBtn).toNotExist();
        var tasks = byComponents(root, ListItemTemplate);
        expect(tasks.length).toBe(3);
        tasks.forEach(function (task) {
            task = task.refs.buttons.refs;
            expect(task.upBtn).toNotExist();
            expect(task.deleteBtn).toNotExist();
            expect(task.downBtn).toNotExist();

            expect(task.upBtn).toNotExist();
            expect(task.deleteBtn).toNotExist();
            expect(task.downBtn).toNotExist();

            expect(task.upBtn).toNotExist();
            expect(task.deleteBtn).toNotExist();
            expect(task.downBtn).toNotExist();
        })
    });

    it.skip('should render a list without data and add values', function () {
        var schema = {
            schema: {
                tasks: {
                    type: 'List',
                    itemType: 'Text',
                    canAdd: true,
                    canEdit: true,
                    canReorder: true,
                    canDelete: true
                }
            }
        }, data = {
            tasks: []
        };
        var root = into(<Form schema={schema} value={data}/>, true);
        var tasks = byComponents(root, ListItemTemplate);
        expect(root).toExist();
        expect(tasks.length).toEqual(0);


        var a0 = add(root, 0);
        expect(byClass(a0, 'btn-up')[0]).toNotExist();
        expect(byClass(a0, 'btn-delete')[0]).toExist();
        expect(byClass(a0, 'btn-down')[0]).toNotExist();

        /*
         var a1 = add(root, 1);
         expect(byClass(a1, 'btn-up')[0]).toExist();
         expect(byClass(a1, 'btn-delete')[0]).toExist();
         expect(byClass(a1, 'btn-down')[0]).toNotExist();

         var a2 = add(root, 2);
         expect(byClass(a2, 'btn-up')[0]).toExist();
         expect(byClass(a0, 'btn-delete')[0]).toExist();
         expect(byClass(a2, 'btn-down')[0]).toNotExist();
         expect(byClass(a1, 'btn-down')[0]).toExist();


         click(byClass(a0, 'btn-delete')[0]);
         expect(root.getValue().tasks.length).toEqual(2);

         click(byClass(a1, 'btn-delete')[0]);
         expect(root.getValue().tasks.length).toEqual(1);

         click(byClass(a2, 'btn-delete')[0]);
         expect(root.getValue().tasks.length).toEqual(0);*/


    });
    it('should edit a value', function () {
        var schema = {
            schema: {
                tasks: {
                    type: 'List',
                    itemType: 'Text',
                    canAdd: true,
                    canEdit: true,
                    canReorder: true,
                    canDelete: true
                }
            }
        }, data = {
            tasks: ['Hello, world 0']
        };
        var root = into(<Form schema={schema} value={data}/>);
        edit(root, 0);
    });
    it('should render edit a value with an error', function () {
        var schema = {
            schema: {
                tasks: {
                    type: 'List',
                    itemType: 'Text',
                    canAdd: true,
                    canEdit: true,
                    canReorder: true,
                    canDelete: true
                }
            }
        }, data = {
            tasks: ['one', 'two']
        }, errors = {
            'tasks.1': [{message: 'Can not be 2'}]
        }
        var root = into(<Form schema={schema} value={data} errors={errors}/>, true);
        var found = TestUtils.scryRenderedComponentsWithType(root, EditorTemplate);
        expect(found[0].props.error).toEqual('Can not be 2');
    });
})