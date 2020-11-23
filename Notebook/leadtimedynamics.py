import os
import pandas as pd
import numpy as np

def create_blocks(numbers, start, end, blocks):
    if start == end: return
     
    min_size = None   
    for i in range(start, end):        
        if(min_size == None or min_size[1] > numbers[i]):
            min_size = [i, numbers[i]]
            if(numbers[i] == 0):
                break

    if(min_size[1] != 0):
        for i in range(start, end):
            numbers[i] -= min_size[1]

        for i in range(0, min_size[1]):
            cycle = end-start
            split = np.random.randint(0, cycle+1)
            if split > 0 and split != cycle:
                blocks.append([cycle-split, end-split])
                blocks.append([split, end])
            else:
                blocks.append([cycle, end])
    
    create_blocks(numbers, start, min_size[0], blocks)
    create_blocks(numbers, min_size[0]+1, end, blocks)

def equalise(numbers):
    while True:
        max, max_index = None, None
        min, min_index = None, None
        for i, number in enumerate(numbers):
            if max == None or max < number:
                max = number
                max_index = i
            if min == None or min > number:
                min = number
                min_index = i

        if max == min or max == min+1: 
            break

        numbers[max_index] -= 1
        numbers[min_index] += 1


def shift_left(_hash, arr_to_shift):
    counter = 0
    for i, arr in enumerate(arr_to_shift):
        old_key, new_key  = "{0}:{1}".format(arr[0],arr[1]), "{0}:{1}".format(arr[0],arr[1]-1)
        if (new_key in _hash) and (old_key in _hash) and len(_hash[old_key]) > 0:
            val = _hash[old_key].pop()
            val[1] -= 1
            _hash[new_key].append(val)
            counter += 1
    return counter

def shift_in(_hash, arr_to_shift):
    for i, arr in enumerate(arr_to_shift):
        key  = "{0}:{1}".format(arr[0],arr[1])
        if key in _hash: 
            _hash[key].append(arr)
        else: 
            _hash[key] = [arr]

def array_to_hash(array):
    _hash = {}
    for i, arr in enumerate(array):
        key = "{0}:{1}".format(arr[0],arr[1])    
        if key in _hash: 
            _hash[key].append(arr)
        else: 
            _hash[key] = [arr]
    return _hash

def hash_to_array(_hash):
    array = []
    for i, k in enumerate(_hash):
        v = _hash.get(k)
        for j in range(len(v)):
            array.append(v[j])
    return np.array(array)

def array_normalise_size(primary, secondary):
    return np.hstack([secondary, np.zeros(len(primary)-len(secondary), dtype=int)])

def reduce(workitems):
    for workitem in workitems:
        reduce = np.random.choice([0,1,2], 1, p=[0.15, 0.7, 0.15])
        if workitem[0] >= reduce and workitem[1] > reduce:
            workitem[0] -= reduce
            workitem[1] -= reduce
    return workitems
  
def unroll(workitems):
    workitem_split = []
    for workitem in workitems:
        workitem_split.append([workitem])
        if workitem[0] > 0 and workitem[1] > 1:
            for i in range(workitem[0]):
                workitem_split.append([1, workitem[1]-i-1])
    return workitem_split

def combination_matrix_to_array(matrix, x_label, y_label):
    combination_values, combination_labels = [],[]
    for row_index, row in enumerate(matrix):
        for cell_index, cell in enumerate(row):
            combination_labels.append([y_label[cell_index], x_label[row_index]])
            combination_values.append(cell)

    return np.array(combination_labels), np.array(combination_values)

def combination_matrix_to_probability(matrix):
    column_row_sum = np.dot(np.full((1,len(matrix.index)), 1), matrix.values)
    column_row_probability = matrix.values / column_row_sum
    column_total_sum = np.sum(column_row_sum)
    column_probability = column_row_sum / column_total_sum
    return column_row_probability * column_probability

def run_simulation(name, mean, std, events, p):
    number_of_workitems = np.random.normal(mean, std).astype(int)
    combinations_indicies = np.random.choice(range(0, len(events)), number_of_workitems, p=p)
    sprint_workitems = events[combinations_indicies]
    name_column = np.full((len(sprint_workitems), 1), name)
    return  np.hstack((name_column, sprint_workitems))

def leadtime_trail(workitems_unrolled):
    df = pd.DataFrame(workitems_unrolled, columns=['CycleTime', 'LeadTime'])
    tail_agg = df.groupby('LeadTime').agg(Count =('LeadTime', 'count'))
    return tail_agg.values.T[0], np.array(tail_agg.index)