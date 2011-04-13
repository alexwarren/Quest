﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AxeSoftware.Quest
{
    public class EditableListUpdatedEventArgs<T> : EventArgs
    {
        public IEditableListItem<T> UpdatedItem { get; set; }
        public int Index { get; set; }
        public EditorUpdateSource Source { get; set; }
    }

    public interface IEditableList<T>
    {
        event EventHandler<EditableListUpdatedEventArgs<T>> Added;
        event EventHandler<EditableListUpdatedEventArgs<T>> Removed;
        event EventHandler<EditableListUpdatedEventArgs<T>> Updated;

        IDictionary<string, IEditableListItem<T>> Items { get; }
        void Add(T item);
        void Remove(params T[] items);
    }

    public interface IEditableListItem<T>
    {
        string Key { get; }
        T Value { get; set; }
    }
}
