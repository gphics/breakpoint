def is_discussion_member(members, user_id):
    is_permitted = user_id in members
    return is_permitted
