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

def leadtime_trail(workitems_unrolled):
    df = pd.DataFrame(workitems_unrolled, columns=['CycleTime', 'LeadTime'])
    tail_agg = df.groupby('LeadTime').agg(Count =('LeadTime', 'count'))
    return tail_agg.values.T[0], np.array(tail_agg.index)

def construct_sprint(name, mean, std, bag):
    number_of_workitems = np.random.normal(mean, std).astype(int)
    indexes = np.random.choice(range(0, len(bag)), number_of_workitems)
    sprint_workitems = bag[indexes]
    name_column = np.full((len(sprint_workitems), 1), name)
    return np.hstack((name_column, sprint_workitems))